import express from 'express';
import { CertificateController } from './certificate.controller';

const router = express.Router();
router.post('/verifyCertificate/:id', CertificateController.verifyCertificate);
router.post('/create', CertificateController.createNew);
router.get('/', CertificateController.getAll);
router.get('/single/:id', CertificateController.getSingle);
router.patch('/update/:id', CertificateController.updateCertificate);
router.delete('/delete/:id', CertificateController.deleteCertificate);
export const CretificateRoutes = router;
