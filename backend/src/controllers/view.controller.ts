import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { asyncHandler } from '../middleware/errorHandler';
import { incrementHouseViewCount } from '../services/view.service';

export const incrementViewCountController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { houseId } = req.params;

    if (!houseId) {
      res.status(400).json({
        success: false,
        message: 'กรุณาระบุ ID ของบ้าน',
      });
      return;
    }

    try {
      const newViewCount = await incrementHouseViewCount(houseId);

      res.json({
        success: true,
        message: 'เพิ่มจำนวนการเข้าชมสำเร็จ',
        data: {
          viewCount: newViewCount
        }
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลบ้าน',
      });
    }
  }
);