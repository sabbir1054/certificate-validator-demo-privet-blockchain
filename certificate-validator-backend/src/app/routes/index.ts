import express from 'express';
import { CretificateRoutes } from '../modules/certificate/certificate.routes';


const router = express.Router();

const moduleRoutes = [
  // ... routes
 {
    path: '/certificate',
    route: CretificateRoutes,
  }, 
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
