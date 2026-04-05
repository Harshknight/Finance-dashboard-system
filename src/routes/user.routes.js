import express from "express";
import { auth } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { createUserByAdmin, updateUserRole, toggleUserStatus } from "../controllers/user.controller.js";
import { getUsers, updateProfile,updatePassword, deleteUser } from "../controllers/user.controller.js";

const router = express.Router();

// Only Admin can manage users
router.get("/", auth, authorizeRoles("admin"), getUsers);

router.post(
  "/create",
  auth,
  authorizeRoles("admin"),
  createUserByAdmin
);

router.patch("/me", auth, updateProfile);

router.patch("/me/password", auth, updatePassword);

router.patch(
  "/:id/role",
  auth,
  authorizeRoles("admin"),
  updateUserRole
);

router.patch(
  "/:id/status",
  auth,
  authorizeRoles("admin"),
  toggleUserStatus
);

router.delete("/:id", auth, authorizeRoles("admin"), deleteUser);

export default router;