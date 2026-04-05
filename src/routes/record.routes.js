import express from "express";
import {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord,
} from "../controllers/record.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { validate } from "../middleware/error.middleware.js";
import { recordSchema ,
  updateRecordSchema,} from "../utils/validator.js";

const router = express.Router();

router.post(
  "/",
  auth,
  authorizeRoles("admin", "analyst"),
  validate(recordSchema),
  createRecord
);



router.get(
  "/",
  auth,
  authorizeRoles("analyst", "admin"), // ❌ viewer blocked
  getRecords
);

router.put(
  "/:id",
  auth,
  authorizeRoles("admin"),
  validate(updateRecordSchema),
  updateRecord
);

router.delete("/:id", auth, authorizeRoles("admin"), deleteRecord);

export default router;