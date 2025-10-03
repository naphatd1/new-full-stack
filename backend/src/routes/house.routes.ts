import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  createHouseController,
  getHouseController,
  getMyHousesController,
  getAllHousesController,
  getFeaturedHousesController,
  updateHouseController,
  deleteHouseController,
} from '../controllers/house.controller';
import { incrementViewCountController } from '../controllers/view.controller';
import {
  createHouseValidator,
  updateHouseValidator,
  houseIdValidator,
} from '../validators/house.validator';

const router = Router();

router.post('/', authenticate, createHouseValidator, createHouseController);

router.get('/', getAllHousesController);

router.get('/featured', getFeaturedHousesController);

router.get('/my', authenticate, getMyHousesController);

router.get('/:id', houseIdValidator, getHouseController);

// Increment view count
router.post('/:houseId/view', incrementViewCountController);

router.put('/:id', authenticate, updateHouseValidator, updateHouseController);

router.delete('/:id', authenticate, houseIdValidator, deleteHouseController);

export default router;