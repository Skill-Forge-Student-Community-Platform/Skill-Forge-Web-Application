import express from "express";


import { saveEvent, getSavedEvents, removeSavedEvent } from '../controllers/saveEventsController.js';

const router = express.Router();




router.post("/save-event", saveEvent);
router.get("/saved-events/:userId", getSavedEvents);
router.delete("/delete-saved-event/:id", deleteSavedEvent);

export default router;
