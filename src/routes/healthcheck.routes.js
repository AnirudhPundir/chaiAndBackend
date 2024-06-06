import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { healthcheck } from "../controllers/healthcheck.controller";

const router = Router();

// Create a router for healthcheck

router.route("/health-check").post(verifyJWT, healthcheck);

export default router;
