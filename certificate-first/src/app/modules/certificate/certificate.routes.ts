import express, { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import httpStatus from 'http-status';
import path from 'path';
import ApiError from '../../../errors/ApiError';
import { FileUploadHelper } from '../../../helpers/fileuploader';
import { CertificateController } from './certificate.controller';
const router = express.Router();
router.post(
  '/verifyCertificate/:id',
  FileUploadHelper.upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.file) {
      req.body.photo = `${req.file.filename}`;
    }
    return CertificateController.verifyCertificate(req, res, next);
  },
);
router.get(
  '/image/:fileName',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filePath = path.join(
        process.cwd(),
        'uploads/',
        path.basename(req.params.fileName),
      );
      console.log(filePath.split(`${req.params.fileName}`)[0]);

      // Check if the file exists
      await fs.promises.access(filePath, fs.constants.F_OK);

      // Send the image file if it exists
      res.sendFile(filePath);
    } catch (err: any) {
      console.log(err);

      if (err.code === 'ENOENT') {
        // File not found, return 404 error
        next(new ApiError(httpStatus.NOT_FOUND, 'Image not found'));
      } else {
        // Handle all other errors as 500 Internal Server Error
        next(
          new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'An error occurred while processing your request',
          ),
        );
      }
    }
  },
);
router.post('/create', CertificateController.createNew);
router.get('/', CertificateController.getAll);
router.get('/single/:id', CertificateController.getSingle);
router.patch('/update/:id', CertificateController.updateCertificate);
router.delete('/delete/:id', CertificateController.deleteCertificate);
export const CretificateRoutes = router;
