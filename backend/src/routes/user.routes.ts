import { Router } from "express";
import {
  getProfile,
  updateProfileController,
  getAllUsersController,
  getUserByIdController,
  toggleUserStatusController,
  deleteUserController,
  updateUserController,
} from "../controllers/user.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import {
  updateProfileValidator,
  userIdValidator,
} from "../validators/user.validator";
import { Role } from "@prisma/client";

const router = Router();

// Protected routes - ต้อง authenticate ทุก route
router.use(authenticate);

router.get("/profile", getProfile);

router.put("/profile", updateProfileValidator, updateProfileController);

router.get("/", authorize(Role.ADMIN, Role.MODERATOR), getAllUsersController);

router.get(
  "/:id",
  authorize(Role.ADMIN, Role.MODERATOR),
  userIdValidator,
  getUserByIdController
);

router.patch(
  "/:id/toggle-status",
  authorize(Role.ADMIN),
  userIdValidator,
  toggleUserStatusController
);

router.put(
  "/:id",
  authorize(Role.ADMIN),
  userIdValidator,
  updateUserController
);

router.delete(
  "/:id",
  authorize(Role.ADMIN),
  userIdValidator,
  deleteUserController
);

export default router;
