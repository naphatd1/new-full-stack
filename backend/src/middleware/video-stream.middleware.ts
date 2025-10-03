import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";

export const videoStreamMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // ตรวจสอบว่าเป็นการขอไฟล์วิดีโอหรือไม่
  if (!req.path.includes('/uploads/videos/') || !req.path.endsWith('.mp4')) {
    return next();
  }

  const videoPath = path.join(process.cwd(), req.path);
  
  // ตรวจสอบว่าไฟล์มีอยู่จริง
  if (!fs.existsSync(videoPath)) {
    return res.status(404).json({ error: 'Video not found' });
  }

  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    // รองรับ range requests สำหรับ video streaming
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = (end - start) + 1;
    const file = fs.createReadStream(videoPath, { start, end });
    
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
      'Cache-Control': 'public, max-age=31536000',
    };
    
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    // ส่งไฟล์ทั้งหมด
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=31536000',
    };
    
    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);
  }
};