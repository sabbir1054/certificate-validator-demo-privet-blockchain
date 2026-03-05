const express = require('express');
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const Tesseract = require('tesseract.js');
const { getContract } = require('../fabric');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

/**
 * Helper: Generate SHA-256 hash from certificate data
 */
function generateHash(data) {
  const { certificateID, studentName, university, department, course, cgpa, issueDate } = data;
  return crypto
    .createHash('sha256')
    .update(`${certificateID}${studentName}${university}${department}${course}${cgpa}${issueDate}`)
    .digest('hex');
}

/**
 * Helper: Parse blockchain response
 */
function parseResponse(buffer) {
  const str = Buffer.from(buffer).toString('utf8').trim();
  try {
    return JSON.parse(str);
  } catch {
    return str;
  }
}

/**
 * Helper: Extract text from certificate image using OCR
 */
async function extractCertificateData(imagePath) {
  const { data: { text } } = await Tesseract.recognize(imagePath, 'eng');

  return {
    certificateID: text.match(/Certificate ID:\s*([A-Za-z0-9-]+)/)?.[1] || null,
    studentName: text.match(/This is to certify that\s*(.+?)\s*has successfully/)?.[1]?.trim() || null,
    university: text.match(/(.*) University/)?.[1] ? `${text.match(/(.*) University/)[1].trim()} University` : null,
    department: text.match(/Department of (.+)/)?.[1]?.trim() || null,
    course: text.match(/completed the course\s*([\w\s]+)\s*in the Department/)?.[1]?.trim() || null,
    cgpa: text.match(/CGPA of\s*([\d.]+)/)?.[1] ? parseFloat(text.match(/CGPA of\s*([\d.]+)/)[1]) : null,
    issueDate: text.match(/Issued on:\s*([\d-]+)/)?.[1] || null
  };
}

// ============ ROUTES ============

/**
 * POST / - Create a new certificate
 */
router.post('/', async (req, res, next) => {
  try {
    const contract = getContract();
    const { certificateID, studentName, university, department, course, cgpa, issueDate } = req.body;

    // Validate required fields
    if (!certificateID || !studentName || !university || !department || !course || !cgpa || !issueDate) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    const hash = generateHash(req.body);

    await contract.submitTransaction(
      'CreateCertificate',
      certificateID,
      studentName,
      university,
      department,
      course,
      cgpa.toString(),
      issueDate,
      hash
    );

    res.status(201).json({
      success: true,
      message: 'Certificate created successfully',
      data: { certificateID, hash }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET / - Get all certificates
 */
router.get('/', async (req, res, next) => {
  try {
    const contract = getContract();
    const result = await contract.evaluateTransaction('GetAllCertificates');
    const certificates = parseResponse(result);

    res.json({ success: true, data: certificates });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /:id - Get a single certificate by ID
 */
router.get('/:id', async (req, res, next) => {
  try {
    const contract = getContract();
    const { id } = req.params;

    const result = await contract.evaluateTransaction('ReadCertificate', id);
    const certificate = parseResponse(result);

    res.json({ success: true, data: certificate });
  } catch (error) {
    if (error.message.includes('does not exist')) {
      return res.status(404).json({ success: false, error: 'Certificate not found' });
    }
    next(error);
  }
});

/**
 * PATCH /:id - Update a certificate
 */
router.patch('/:id', async (req, res, next) => {
  try {
    const contract = getContract();
    const { id } = req.params;
    const { course, department, cgpa, studentName } = req.body;

    // Get existing certificate
    const existing = await contract.evaluateTransaction('ReadCertificate', id);
    const prev = parseResponse(existing);

    // Merge with existing data
    const updated = {
      certificateID: id,
      studentName: studentName || prev.studentName,
      university: prev.university,
      department: department || prev.department,
      course: course || prev.course,
      cgpa: cgpa || prev.cgpa,
      issueDate: prev.issueDate
    };

    const hash = generateHash(updated);

    await contract.submitTransaction(
      'UpdateCertificate',
      id,
      hash,
      updated.course,
      updated.department,
      updated.cgpa.toString(),
      updated.studentName
    );

    res.json({ success: true, message: 'Certificate updated successfully' });
  } catch (error) {
    if (error.message.includes('does not exist')) {
      return res.status(404).json({ success: false, error: 'Certificate not found' });
    }
    next(error);
  }
});

/**
 * DELETE /:id - Revoke a certificate
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const contract = getContract();
    const { id } = req.params;

    await contract.submitTransaction('RevokeCertificate', id);

    res.json({ success: true, message: 'Certificate revoked successfully' });
  } catch (error) {
    if (error.message.includes('does not exist')) {
      return res.status(404).json({ success: false, error: 'Certificate not found' });
    }
    next(error);
  }
});

/**
 * POST /verify - Verify a certificate (with image upload and OCR)
 */
router.post('/verify', upload.single('file'), async (req, res, next) => {
  let filePath = null;

  try {
    const contract = getContract();

    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Certificate image is required' });
    }

    filePath = req.file.path;

    // Extract data from image using OCR
    const extractedData = await extractCertificateData(filePath);

    if (!extractedData.certificateID) {
      return res.status(400).json({
        success: false,
        error: 'Could not extract certificate ID from image',
        extractedData
      });
    }

    const hash = generateHash(extractedData);

    // Verify on blockchain
    const result = await contract.evaluateTransaction('VerifyCertificate', extractedData.certificateID, hash);
    const isValid = parseResponse(result);

    res.json({
      success: true,
      data: {
        isValid: isValid === true || isValid === 'true',
        extractedData,
        hash
      }
    });
  } catch (error) {
    next(error);
  } finally {
    // Clean up uploaded file
    if (filePath) {
      try {
        await fs.unlink(filePath);
      } catch {}
    }
  }
});

module.exports = router;
