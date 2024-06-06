import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controllers/like.controller";

const router = Router();

// router for liking viddeos
router.route("/like-video").post(verifyJWT, toggleVideoLike);

// router for liking tweets
router.route("/like-tweet").post(verifyJWT, toggleTweetLike);

// router for liking comment
router.route("/like-comment").post(verifyJWT, toggleCommentLike);

export default router;

