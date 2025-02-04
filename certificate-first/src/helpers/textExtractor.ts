import path from 'path';
import Tesseract from 'tesseract.js';

// Function to extract text from image
export const extractText = async (image: string) => {
  // Ensure the image path is absolute
  const imagePath = path.isAbsolute(image) ? image : path.resolve(image);
  console.log(`Processing Image: ${imagePath}`);

  try {
    const {
      data: { text },
    } = await Tesseract.recognize(imagePath, 'eng');

    // Define regex patterns to extract specific details accurately
    const patterns: any = {
      certificateID: /Certificate ID:\s*([\w-]+)/i,
      studentName: /presented to\s*([\w\s]+?)\n/i, // Extracts name until the first newline
      university: /at\s+([\w\s]+?)\s*\n/i, // Extracts only the university name
      department: /Department of\s+([\w\s]+?)\s*\n/i, // Extracts only department name
      course: /course of study in\s+([\w\s]+?)\s*\n/i, // Extracts only course name
      cgpa: /GPA of\s*([\d.]+\/\d.\d)/i, // Extracts GPA in format "3.9/4.0"
      issueDate: /Awarded this\s*(.+?)\n/i, // Extracts issue date
    };

    // Extract and clean data
    const certificateData: any = {};
    for (const key in patterns) {
      const match = text.match(patterns[key]);
      certificateData[key] = match
        ? match[1].replace(/\n/g, ' ').trim()
        : 'Not Found';
    }

    return certificateData;
  } catch (error) {
    console.error('Error extracting text:', error);
  }
};
