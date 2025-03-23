

import express from "express";
import { getEvents, createProduct, getEventsId, deleteEvent, deleteEventAll, editEvent } from "../Controllers/eventController.js";

const router = express.Router();

router.get("/", getEvents);
router.post("/", createProduct);//Ok for User Id
router.get("/:event_id", getEventsId);

router.delete("/:event_id", deleteEvent);
router.delete("/", deleteEventAll);
router.put("/:event_id", editEvent);

export default router;
