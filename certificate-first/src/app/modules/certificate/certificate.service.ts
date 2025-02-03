import { createHash } from 'crypto';
import httpStatus from 'http-status';
import { getContract } from '../../../connection';
import ApiError from '../../../errors/ApiError';
const create = async (payload: any) => {
  const contract = getContract();
  if (!contract) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Failed to initialize Fabric connection.',
    );
  }

  const {
    certificateID,
    studentName,
    university,
    department,
    course,
    cgpa,
    issueDate,
  } = payload;

  const hash = await createHash('sha256')
    .update(
      `${certificateID}${studentName}${university}${department}${course}${cgpa}${issueDate}`,
    )
    .digest('hex');

  const result = await contract.submitTransaction(
    'CreateCertificate',

    certificateID,
    studentName,
    university,
    department,
    course,
    cgpa.toString(),
    issueDate,
    hash,
  );

  return result;
};

const getAll = async () => {
  const contract = getContract();
  if (!contract) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Failed to initialize Fabric connection.',
    );
  }
  const result = await contract.evaluateTransaction('GetAllCertificates');
  console.log(result);

  // Convert buffer to string
  const resultString = Buffer.from(result).toString('utf8');

  // Trim any unwanted characters and parse JSON
  return JSON.parse(resultString.trim());
};
const getSingle = async (certificateID: string) => {
  const contract = getContract();
  if (!contract) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Failed to initialize Fabric connection.',
    );
  }
  if (!certificateID) {
    throw new ApiError(httpStatus.NOT_FOUND, 'certificateID is required.');
  }
  const result = await contract.evaluateTransaction(
    'ReadCertificate',
    certificateID,
  );

  // Convert buffer to string
  const resultString = Buffer.from(result).toString('utf8');

  // Trim any unwanted characters and parse JSON
  return JSON.parse(resultString.trim());
};

const updateCertificate = async (
  certificateID: string,
  updatedData: {
    course?: string;
    department?: string;
    studentName?: string;
    cgpa?: number;
  },
) => {
  if (!certificateID) {
    throw new ApiError(httpStatus.NOT_FOUND, 'certificateID is required.');
  }

  if (!updatedData || typeof updatedData !== 'object') {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'updatedData must be a valid object.',
    );
  }

  const contract = getContract();

  if (!contract) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to initialize Fabric contract.',
    );
  }

  const { course = '', department = '', cgpa = '' } = updatedData;

  // Call the smart contract function to update the certificate
  const result = await contract.submitTransaction(
    'UpdateCertificate',
    certificateID,
    course,
    department,
    cgpa.toString(), // Convert number to string, as Fabric only accepts string arguments
  );
  return result;
};

const verifyCertificate = async (
  certificateID: string,
  providedHash: string,
) => {
  const contract = getContract();
  if (!contract) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Failed to initialize Fabric connection.',
    );
  }
  if (!certificateID || !providedHash) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'certificateID and providedHash are required.',
    );
  }

  // Call the VerifyCertificate chaincode function
  const result = await contract.evaluateTransaction(
    'VerifyCertificate',
    certificateID,
    providedHash,
  );

  // Convert buffer result to boolean
  const resultString = Buffer.from(result).toString('utf8');

  // Trim any unwanted characters and parse JSON
  return resultString;
};

const deleteCertificate = async (certificateID: string) => {
  const contract = getContract();
  if (!contract) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Failed to initialize Fabric connection.',
    );
  }
  if (!certificateID) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'certificateID is required.');
  }

  await contract.submitTransaction('RevokeCertificate', certificateID);
  return;
};

export const certificateService = {
  create,
  getAll,
  getSingle,
  updateCertificate,
  verifyCertificate,
  deleteCertificate,
};
