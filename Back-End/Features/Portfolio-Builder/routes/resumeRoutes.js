import express from "express";
import { saveResume, getResumes, updateResume, deleteResume, getResumesbyId } from "../controllers/resumeController.js";

const router = express.Router();

router.post("/", saveResume);
router.get("/", getResumes);
router.get("/:id", getResumesbyId);
router.put("/:id", updateResume);
router.delete("/:id", deleteResume);

export default router;
