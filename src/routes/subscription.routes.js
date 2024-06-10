import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription } from "../controllers/subscription.controller";

const router = Router();

router.route("/toggle-subscription/:channelId").post(verifyJWT, toggleSubscription);

router.route("/get-user-channel-subscribers/:channelId").post(verifyJWT, getUserChannelSubscribers);

router.route("/get-subscribed-channels/:subcriberId").post(verifyJWT, getSubscribedChannels);

export default router;

