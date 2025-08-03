import express from "express";
import { authenticateToken } from "../middleware/auth.js";

import {
  createPerson,
  getAllPeople,
  getPersonById,
  updatePerson,
  deletePerson,
} from "../controllers/personController.js";

const router = express.Router();

router.use(authenticateToken); // All routes require auth

router.post("/", createPerson);
router.get("/", getAllPeople);
router.get("/:id", getPersonById);
router.put("/:id", updatePerson);
router.delete("/:id", deletePerson);

export default router;
