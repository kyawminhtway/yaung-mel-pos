import { Router } from "express";
import controllers from './controllers.js';
import CheckRecordID from '../../middlewares/checkRecordID.js';

const router = Router();

router.get('/:id', CheckRecordID, controllers.getAppUserByID);
router.get('/', controllers.getAppUser);
router.post('/', controllers.createAppUser);
router.patch('/:id', CheckRecordID, controllers.updateAppUser);
router.delete('/:id', CheckRecordID, controllers.deleteUser);

export default router;