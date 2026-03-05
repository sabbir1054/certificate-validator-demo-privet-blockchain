import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { certificateService } from './certificate.service';
const createNew = catchAsync(async (req: Request, res: Response) => {
  const result = await certificateService.create(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Certificate created',
    data: result,
  });
});

const getAll = catchAsync(async (req: Request, res: Response) => {
  const result = await certificateService.getAll();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Certificate retrieve',
    data: result,
  });
});

const getSingle = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await certificateService.getSingle(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Certificate retrieve',
    data: result,
  });
});
const deleteCertificate = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await certificateService.deleteCertificate(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Certificate delete',
    data: result,
  });
});
const verifyCertificate = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    const result = await certificateService.verifyCertificate(req, next);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Certificate',
      data: result,
    });
  },
);

const updateCertificate = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await certificateService.updateCertificate(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Certificate updated',
    data: result,
  });
});

export const CertificateController = {
  createNew,
  getAll,
  getSingle,
  updateCertificate,
  verifyCertificate,
  deleteCertificate,
};
