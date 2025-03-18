import express from 'express'
import { verifyToken } from '../../User-Authentication/middleware/auth.middleware.js';
import { createTeam, sendInvite, getTeamsByUser} from '../Controllers/team.controller.js';

const router = express.Router();

router.post("/createTeam", verifyToken, createTeam);
router.get("/getTeams", verifyToken, getTeamsByUser);
router.post('/invite', verifyToken, sendInvite);


export default router;
