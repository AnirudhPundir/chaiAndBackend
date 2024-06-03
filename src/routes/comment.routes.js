import { Router } from "express";
import { addComment, deleteComment, getVideoComments, updateComment } from "../controllers/comment.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();

//FETCH VIDEO COMMENTS
router.route("/fetch-video-comments").post(verifyJWT, getVideoComments);

//ADD A COMMENT TO A VIDEO
router.route("/add-comment").post(verifyJWT, addComment);

//UPDATE A COMMENT ON A VIDEO
router.route("/update-comment").post(verifyJWT, updateComment);

//DELETE A COMMENT FROM A VIDEO
router.route("/delete-commnet").post(verifyJWT, deleteComment); 

export default router;