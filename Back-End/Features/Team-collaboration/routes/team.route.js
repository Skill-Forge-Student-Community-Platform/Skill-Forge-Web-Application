import express from "express";
import { verifyToken } from "../../User-Authentication/middleware/auth.middleware.js";
import {
  createTeam,
  getTeamsByUser,
  sendInvite,
  respondToInvite,
  getReceivedInvites,
  getSentInvites,
  kickMemberFromTeam,
  getTeamsByTechnology,
} from "../Controllers/team.controller.js";
import { searchUsers } from "../Controllers/user.controller.js";

const router = express.Router();

router.post("/createTeam", verifyToken, createTeam);
router.get("/getTeams", verifyToken, getTeamsByUser);
router.post("/invite", verifyToken, sendInvite);
router.post("/respondToInvite", verifyToken, respondToInvite);
router.get("/invites/received", verifyToken, getReceivedInvites);
router.get("/invites/sent", verifyToken, getSentInvites);
router.post("/kick-member", verifyToken, kickMemberFromTeam);
router.get("/getTeamsByTechnology", verifyToken, getTeamsByTechnology);

router.get("/search", verifyToken, searchUsers);

export default router;
