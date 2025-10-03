import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  uploadHouseVideos,
  handleVideoUploadError,
  validateHouseVideoUpload,
  validateVideoContentType,
} from "../middleware/video-upload.middleware";
import {
  uploadHouseVideosController,
  getHouseVideosController,
  deleteHouseVideoController,
} from "../controllers/house-video.controller";

const router = Router();

// อัปโหลดวิดีโอสำหรับบ้าน
router.post(
  "/:houseId/videos",
  authenticate,
  validateVideoContentType,
  uploadHouseVideos,
  handleVideoUploadError,
  validateHouseVideoUpload,
  uploadHouseVideosController
);

// ดึงรายการวิดีโอของบ้าน
router.get("/:houseId/videos", getHouseVideosController);

// ลบวิดีโอเฉพาะไฟล์
router.delete(
  "/:houseId/videos/:filename",
  authenticate,
  deleteHouseVideoController
);

export default router;