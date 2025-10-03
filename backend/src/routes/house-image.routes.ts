import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  uploadHouseImagesController,
  getHouseImagesController,
  setMainImageController,
  reorderImagesController,
  deleteHouseImageController,
} from '../controllers/house-image.controller';
import {
  uploadHouseImages,
  handleUploadError,
  validateHouseImageUpload,
  validateContentType,
} from '../middleware/house-upload.middleware';
import { houseIdValidator, reorderImagesValidator } from '../validators/house.validator';

const router = Router();

router.post(
  '/:houseId/images',
  authenticate,
  validateContentType,
  uploadHouseImages,
  handleUploadError,
  validateHouseImageUpload,
  uploadHouseImagesController
);

router.get('/:houseId/images', houseIdValidator, getHouseImagesController);

router.put(
  '/:houseId/images/:imageId/main',
  authenticate,
  setMainImageController
);

router.put(
  '/:houseId/images/reorder',
  authenticate,
  reorderImagesValidator,
  reorderImagesController
);

router.delete(
  '/:houseId/images/:imageId',
  authenticate,
  deleteHouseImageController
);

export default router;