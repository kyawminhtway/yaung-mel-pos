import { Router } from "express";
import controllers from "./controllers.js";

const router = Router();

router.post('/', controllers.auth);

export default router;