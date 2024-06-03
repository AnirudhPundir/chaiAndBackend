import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware";
import { getChannelStats, getChannelVideos } from "../controllers/dashboard.controller";

const router = Router();

// Route to fetch channel Stats
router.route("/channel-stats").post(verifyJWT, getChannelStats);


// Route to fetch channel vids

router.route("/channel-vids").post(verifyJWT, getChannelVideos);

export default router;
