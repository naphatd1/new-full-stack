import { Response } from "express";
import { validationResult } from "express-validator";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { asyncHandler } from "../middleware/errorHandler";
import {
  createHouse,
  getHouseById,
  getHousesByOwner,
  getAllHouses,
  updateHouse,
  deleteHouse,
  checkHouseOwnership,
  CreateHouseData,
  UpdateHouseData,
  HouseFilters,
  QueryOptions,
} from "../services/house.service";
import { deleteHouseFolder } from "../services/image.service";
import { deleteVideoFolder } from "../services/video.service";
import { HouseType, HouseStatus } from "@prisma/client";

export const createHouseController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: "ข้อมูลไม่ถูกต้อง",
        errors: errors.array(),
      });
      return;
    }

    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({
        success: false,
        message: "ไม่ได้รับอนุญาต",
      });
      return;
    }

    const houseData: CreateHouseData = {
      ...req.body,
      ownerId: userId,
      price: parseInt(req.body.price),
      area: parseFloat(req.body.area),
      landArea: req.body.landArea ? parseFloat(req.body.landArea) : undefined,
    };

    const house = await createHouse(houseData);

    res.status(201).json({
      success: true,
      message: "สร้างข้อมูลบ้านสำเร็จ",
      data: house,
    });
  }
);

export const getHouseController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id } = req.params;

    const house = await getHouseById(id);
    if (!house) {
      res.status(404).json({
        success: false,
        message: "ไม่พบข้อมูลบ้าน",
      });
      return;
    }

    res.json({
      success: true,
      data: house,
    });
  }
);

export const getMyHousesController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({
        success: false,
        message: "ไม่ได้รับอนุญาต",
      });
      return;
    }

    const houses = await getHousesByOwner(userId);

    res.json({
      success: true,
      data: houses,
    });
  }
);

export const getAllHousesController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const {
      city,
      province,
      houseType,
      status,
      minPrice,
      maxPrice,
      minBedrooms,
      maxBedrooms,
    } = req.query;

    const filters: HouseFilters = {};
    if (city) filters.city = city as string;
    if (province) filters.province = province as string;
    if (houseType) filters.houseType = houseType as HouseType;
    if (status) filters.status = status as HouseStatus;
    if (minPrice) filters.minPrice = parseFloat(minPrice as string);
    if (maxPrice) filters.maxPrice = parseFloat(maxPrice as string);
    if (minBedrooms) filters.minBedrooms = parseInt(minBedrooms as string);
    if (maxBedrooms) filters.maxBedrooms = parseInt(maxBedrooms as string);

    const result = await getAllHouses(filters);

    res.json({
      success: true,
      data: result,
    });
  }
);

export const getFeaturedHousesController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    // Get the latest 6 houses (all houses are now user-created)
    const houses = await getAllHouses(
      {}, // No filters needed since we only have user-created houses
      { limit: 6, sortBy: "createdAt", sortOrder: "desc" }
    );

    res.json({
      success: true,
      data: houses.data, // Return just the data array, not the pagination wrapper
    });
  }
);

export const updateHouseController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: "ข้อมูลไม่ถูกต้อง",
        errors: errors.array(),
      });
      return;
    }

    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "ไม่ได้รับอนุญาต",
      });
      return;
    }

    // ตรวจสอบความเป็นเจ้าของหรือเป็น admin
    const isOwner = await checkHouseOwnership(id, userId);
    const isAdmin =
      req.user?.role === "ADMIN" || req.user?.role === "MODERATOR";

    if (!isOwner && !isAdmin) {
      res.status(403).json({
        success: false,
        message: "คุณไม่มีสิทธิ์แก้ไขบ้านนี้",
      });
      return;
    }

    const updateData: UpdateHouseData = { ...req.body };
    if (req.body.price) updateData.price = parseFloat(req.body.price);
    if (req.body.area) updateData.area = parseFloat(req.body.area);
    if (req.body.landArea) updateData.landArea = parseFloat(req.body.landArea);

    const house = await updateHouse(id, updateData);

    res.json({
      success: true,
      message: "อัปเดตข้อมูลบ้านสำเร็จ",
      data: house,
    });
  }
);

export const deleteHouseController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "ไม่ได้รับอนุญาต",
      });
      return;
    }

    // ตรวจสอบความเป็นเจ้าของหรือเป็น admin
    const isOwner = await checkHouseOwnership(id, userId);
    const isAdmin =
      req.user?.role === "ADMIN" || req.user?.role === "MODERATOR";

    if (!isOwner && !isAdmin) {
      res.status(403).json({
        success: false,
        message: "คุณไม่มีสิทธิ์ลบบ้านนี้",
      });
      return;
    }

    await deleteHouse(id);

    // ลบโฟลเดอร์รูปภาพและวิดีโอ
    await deleteHouseFolder(id);
    await deleteVideoFolder(id);

    res.json({
      success: true,
      message: "ลบข้อมูลบ้านสำเร็จ",
    });
  }
);
