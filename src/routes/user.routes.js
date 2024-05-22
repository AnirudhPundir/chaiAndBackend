import {Router} from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser, updateAvatar, updateCoverImage } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js";
import multer from "multer";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "./public/temp");
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
})

const router = Router();

router.post("/register", multer({storage}).fields([
    {
        "name" : "avatar",
    },
    {
        "name" : "coverImage",
    },
]),
registerUser);
// TODO :- handle files with multer

//login route
router.route("/login").post(loginUser);

//secured routes
//logout route
router.route("/logout").post(verifyJWT, logoutUser)

//refresh access token route
router.route("/refresh-token").post(refreshAccessToken);

//update avatar and coverImage route
router.route("/update-avatar").post(verifyJWT, multer({storage}).single('avatar'), updateAvatar);

router.route("/update-coverImage").post(verifyJWT, multer({storage}).single('coverImage'), updateCoverImage);


export default router;

// /Users/anirudhpundir/Documents/JSProjects/chai-backend/public/temp/sushi.png