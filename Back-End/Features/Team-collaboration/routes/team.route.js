import express from 'express'
// import { protectRoute } from "../middleware/auth.middleware.js";
import { createTeam, sendInvite, acceptInvite, getTeamsByUser} from '../controllers/team.controller.js'

const router = express.Router();

// router.post("/createTeam", protectRoute, createTeam);
// router.get("/getTeams", protectRoute, getTeamsByUser);
// router.post('/invite', sendInvite);
// router.post('/acceptInvite', acceptInvite);
// router.get('/by-interest/:technology', getTeamsByInterest);

export default router;
