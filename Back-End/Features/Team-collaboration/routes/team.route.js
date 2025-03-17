import express from 'express'
<<<<<<< HEAD

// import {protectRoute} from "../../User-Authentication/middleware/auth.middleware.js";

=======
// import {protectRoute} from "../../User-Authentication/middleware/auth.middleware.js";
>>>>>>> a083d0924c93b0bf239def691b09391aeba88a05
import { createTeam, sendInvite, acceptInvite, getTeamsByUser} from '../controllers/team.controller.js'

const router = express.Router();

// router.post("/createTeam", protectRoute, createTeam);
// router.get("/getTeams", protectRoute, getTeamsByUser);
// router.post('/invite', sendInvite);
// router.post('/acceptInvite', acceptInvite);
// router.get('/by-interest/:technology', getTeamsByInterest);

export default router;
