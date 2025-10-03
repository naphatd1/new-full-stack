import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { asyncHandler } from "../middleware/errorHandler";
import { checkHouseOwnership } from "../services/house.service";
import {
  processHouseVideos,
  getHouseVideos,
  deleteHouseVideo,
  VideoProcessingOptions,
} from "../services/video.service";

export const uploadHouseVideosController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { houseId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "ไม่ได้รับอนุญาต",
      });
      return;
    }

    // ตรวจสอบความเป็นเจ้าของหรือเป็น admin
    const isOwner = await checkHouseOwnership(houseId, userId);
    const isAdmin =
      req.user?.role === "ADMIN" || req.user?.role === "MODERATOR";

    if (!isOwner && !isAdmin) {
      res.status(403).json({
        success: false,
        message: "คุณไม่มีสิทธิ์อัปโหลดวิดีโอสำหรับบ้านนี้",
      });
      return;
    }

    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      res.status(400).json({
        success: false,
        message: "ไม่พบไฟล์วิดีโอ",
      });
      return;
    }

    // ตัวเลือกการบีบอัด
    const { quality = "medium" } = req.body;
    const options: VideoProcessingOptions = {
      quality: quality as "low" | "medium" | "high",
    };

    try {
      const results = await processHouseVideos(files, houseId, options);

      res.status(201).json({
        success: true,
        message: `อัปโหลดและบีบอัดวิดีโอสำเร็จ ${results.length} ไฟล์`,
        data: {
          videos: results,
          totalFiles: results.length,
          totalOriginalSize: results.reduce((sum, r) => sum + r.originalSize, 0),
          totalCompressedSize: results.reduce((sum, r) => sum + r.compressedSize, 0),
          averageCompressionRatio: results.reduce((sum, r) => sum + r.compressionRatio, 0) / results.length,
        },
      });
    } catch (error) {
      console.error("Video upload error:", error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการประมวลผลวิดีโอ",
      });
    }
  }
);

export const getHouseVideosController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { houseId } = req.params;

    try {
      const videos = await getHouseVideos(houseId);

      res.json({
        success: true,
        data: {
          videos: videos.map(filename => ({
            filename,
            url: `/uploads/videos/${houseId}/${filename}`,
          })),
          totalVideos: videos.length,
        },
      });
    } catch (error) {
      console.error("Get videos error:", error);
      res.status(500).json({
        success: false,
        message: "เกิดข้อผิดพลาดในการดึงรายการวิดีโอ",
      });
    }
  }
);

export const deleteHouseVideoController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { houseId, filename } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "ไม่ได้รับอนุญาต",
      });
      return;
    }

    // ตรวจสอบความเป็นเจ้าของหรือเป็น admin
    const isOwner = await checkHouseOwnership(houseId, userId);
    const isAdmin =
      req.user?.role === "ADMIN" || req.user?.role === "MODERATOR";

    if (!isOwner && !isAdmin) {
      res.status(403).json({
        success: false,
        message: "คุณไม่มีสิทธิ์ลบวิดีโอนี้",
      });
      return;
    }

    try {
      await deleteHouseVideo(houseId, filename);

      res.json({
        success: true,
        message: "ลบวิดีโอสำเร็จ",
      });
    } catch (error) {
      console.error("Delete video error:", error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการลบวิดีโอ",
      });
    }
  }
);