import fs from "fs/promises";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import { promisify } from "util";

// กำหนด path ของ ffmpeg
ffmpeg.setFfmpegPath("/opt/homebrew/bin/ffmpeg");
ffmpeg.setFfprobePath("/opt/homebrew/bin/ffprobe");

export interface VideoProcessingOptions {
  quality?: "low" | "medium" | "high";
  maxWidth?: number;
  maxHeight?: number;
  bitrate?: string;
  fps?: number;
}

export interface ProcessedVideo {
  filename: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  duration?: number;
  resolution?: string;
}

// สร้างโฟลเดอร์สำหรับเก็บวิดีโอ
export const createVideoFolder = async (houseId: string): Promise<string> => {
  const videoDir = path.join(process.cwd(), "uploads", "videos", houseId);

  try {
    await fs.access(videoDir);
  } catch {
    await fs.mkdir(videoDir, { recursive: true });
  }

  return videoDir;
};

// ลบโฟลเดอร์วิดีโอของบ้าน
export const deleteVideoFolder = async (houseId: string): Promise<void> => {
  const videoDir = path.join(process.cwd(), "uploads", "videos", houseId);

  try {
    await fs.access(videoDir);
    await fs.rm(videoDir, { recursive: true, force: true });
  } catch (error) {
    console.log(
      `Video folder for house ${houseId} not found or already deleted`
    );
  }
};

// บีบอัดวิดีโอด้วย ffmpeg
export const compressVideo = async (
  inputBuffer: Buffer,
  outputPath: string,
  options: VideoProcessingOptions = {}
): Promise<ProcessedVideo> => {
  const {
    quality = "medium",
    maxWidth = 1920,
    maxHeight = 1080,
    fps = 30,
  } = options;

  // กำหนด bitrate ตาม quality
  const bitrateMap = {
    low: "500k",
    medium: "1000k",
    high: "2000k",
  };

  const bitrate = options.bitrate || bitrateMap[quality];

  // สร้างไฟล์ temp สำหรับ input
  const tempInputPath = path.join(
    path.dirname(outputPath),
    `temp_${Date.now()}.tmp`
  );

  try {
    // เขียน buffer ลงไฟล์ temp
    await fs.writeFile(tempInputPath, inputBuffer);

    // สร้าง promise wrapper สำหรับ ffmpeg
    const processVideo = (): Promise<ProcessedVideo> => {
      return new Promise((resolve, reject) => {
        let duration: number | undefined;
        let resolution: string | undefined;

        ffmpeg(tempInputPath)
          .videoCodec("libx264")
          .audioCodec("aac")
          .videoBitrate(bitrate)
          .fps(fps)
          .size(`${maxWidth}x${maxHeight}`)
          .autopad()
          .format("mp4")
          .outputOptions([
            "-preset fast",
            "-crf 23",
            "-movflags +faststart", // สำหรับ streaming
          ])
          .on("codecData", (data) => {
            duration = parseFloat(data.duration.replace(/:/g, "")) || undefined;
            resolution = data.video_details?.[0] || undefined;
          })
          .on("end", async () => {
            try {
              const stats = await fs.stat(outputPath);
              const compressedSize = stats.size;
              const originalSize = inputBuffer.length;
              const compressionRatio =
                ((originalSize - compressedSize) / originalSize) * 100;

              resolve({
                filename: path.basename(outputPath),
                originalSize,
                compressedSize,
                compressionRatio: Math.round(compressionRatio * 100) / 100,
                duration,
                resolution,
              });
            } catch (error) {
              reject(error);
            }
          })
          .on("error", (error) => {
            reject(new Error(`การบีบอัดวิดีโอล้มเหลว: ${error.message}`));
          })
          .save(outputPath);
      });
    };

    const result = await processVideo();

    // ลบไฟล์ temp
    try {
      await fs.unlink(tempInputPath);
    } catch (error) {
      console.log("Failed to delete temp file:", error);
    }

    return result;
  } catch (error) {
    // ลบไฟล์ temp ในกรณีที่เกิดข้อผิดพลาด
    try {
      await fs.unlink(tempInputPath);
    } catch {}

    throw error;
  }
};

// ประมวลผลวิดีโอหลายไฟล์
export const processHouseVideos = async (
  files: Express.Multer.File[],
  houseId: string,
  options: VideoProcessingOptions = {}
): Promise<ProcessedVideo[]> => {
  const videoDir = await createVideoFolder(houseId);
  const results: ProcessedVideo[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const timestamp = Date.now();
    const filename = `video_${i + 1}_${timestamp}.mp4`;
    const outputPath = path.join(videoDir, filename);

    try {
      const result = await compressVideo(file.buffer, outputPath, options);
      results.push(result);
    } catch (error) {
      console.error(`Failed to process video ${file.originalname}:`, error);
      throw new Error(`การประมวลผลวิดีโอ ${file.originalname} ล้มเหลว`);
    }
  }

  return results;
};

// ดึงรายการวิดีโอของบ้าน
export const getHouseVideos = async (houseId: string): Promise<string[]> => {
  const videoDir = path.join(process.cwd(), "uploads", "videos", houseId);

  try {
    const files = await fs.readdir(videoDir);
    return files.filter((file) => file.endsWith(".mp4"));
  } catch (error) {
    return [];
  }
};

// ลบวิดีโอเฉพาะไฟล์
export const deleteHouseVideo = async (
  houseId: string,
  filename: string
): Promise<void> => {
  const videoPath = path.join(
    process.cwd(),
    "uploads",
    "videos",
    houseId,
    filename
  );

  try {
    await fs.unlink(videoPath);
  } catch (error) {
    throw new Error(`ไม่สามารถลบวิดีโอ ${filename} ได้`);
  }
};
