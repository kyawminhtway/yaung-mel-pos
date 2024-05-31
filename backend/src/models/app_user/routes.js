import { Router } from "express";
import controllers from './controllers.js';

const router = Router();

router.post('/', controllers.createAppUser);
router.get('/', controllers.getAppUser);

export default router;