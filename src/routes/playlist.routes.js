import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { addVideoToPlaylist, createPlaylist, deletePlaylist, getUserPlaylistById, getUserPlaylists, removeVideoFromPlaylist, updatePlaylist } from "../controllers/playlist.controller";

const router = Router();

router.route("/create-playlist").post(verifyJWT, createPlaylist);

router.route("/fetch-playlists").get(verifyJWT, getUserPlaylists);

router.route("/fetch-playlist-by-id").get(verifyJWT, getUserPlaylistById);

router.route("/add-video-to-playlist").post(verifyJWT, addVideoToPlaylist);

router.route("/remove-video-from-playlist").post(verifyJWT, removeVideoFromPlaylist);

router.route("/delete-playlist").post(verifyJWT, deletePlaylist);

router.route("/update-playlist").post(verifyJWT, updatePlaylist);

export default router;









