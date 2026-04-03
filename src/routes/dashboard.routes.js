import express from "express";
import { getSummary } from "../controllers/dashboard.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.get(
  "/",
  auth,
  authorizeRoles("viewer", "analyst", "admin"),
  getSummary
);

export default router;