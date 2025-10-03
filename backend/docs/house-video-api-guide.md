# 🎥 House Video API Guide

## ภาพรวม
API สำหรับจัดการวิดีโอของบ้าน รองรับการอัปโหลด บีบอัด และจัดการไฟล์วิดีโอ

## ฟีเจอร์หลัก
- ✅ อัปโหลดวิดีโอหลายไฟล์พร้อมกัน (สูงสุด 5 ไฟล์)
- ✅ บีบอัดวิดีโออัตโนมัติด้วย FFmpeg
- ✅ รองรับไฟล์วิดีโอหลายรูปแบบ (MP4, AVI, MOV, WebM, MKV)
- ✅ ตั้งค่าคุณภาพการบีบอัดได้ (low, medium, high)
- ✅ ระบบจัดการสิทธิ์ (เฉพาะเจ้าของบ้านและ Admin)
- ✅ การลบวิดีโอเฉพาะไฟล์

## Endpoints

### 1. อัปโหลดวิดีโอ
```
POST /v1/api/houses/:houseId/videos
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Parameters:**
- `houseId` (path): ID ของบ้าน

**Body (FormData):**
- `videos` (files): ไฟล์วิดีโอ (สูงสุด 5 ไฟล์, แต่ละไฟล์ไม่เกิน 500MB)
- `quality` (string, optional): คุณภาพการบีบอัด
  - `low`: 500k bitrate (ไฟล์เล็กที่สุด)
  - `medium`: 1000k bitrate (ค่าเริ่มต้น)
  - `high`: 2000k bitrate (คุณภาพดีที่สุด)

**รูปแบบไฟล์ที่รองรับ:**
- MP4 (video/mp4)
- AVI (video/avi, video/x-msvideo)
- MOV (video/mov, video/quicktime)
- WebM (video/webm)
- MKV (video/mkv, video/x-matroska)

**Response Success (201):**
```json
{
  "success": true,
  "message": "อัปโหลดและบีบอัดวิดีโอสำเร็จ 2 ไฟล์",
  "data": {
    "videos": [
      {
        "filename": "video_1_1703123456789.mp4",
        "originalSize": 52428800,
        "compressedSize": 15728640,
        "compressionRatio": 70.0,
        "duration": 30.5,
        "resolution": "1920x1080"
      }
    ],
    "totalFiles": 2,
    "totalOriginalSize": 104857600,
    "totalCompressedSize": 31457280,
    "averageCompressionRatio": 70.0
  }
}
```

**Response Error (400):**
```json
{
  "success": false,
  "message": "ไฟล์วิดีโอมีขนาดใหญ่เกินไป (สูงสุด 500MB ต่อไฟล์)"
}
```

### 2. ดึงรายการวิดีโอ
```
GET /v1/api/houses/:houseId/videos
```

**Parameters:**
- `houseId` (path): ID ของบ้าน

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "videos": [
      {
        "filename": "video_1_1703123456789.mp4",
        "url": "/uploads/videos/house123/video_1_1703123456789.mp4"
      }
    ],
    "totalVideos": 1
  }
}
```

### 3. ลบวิดีโอ
```
DELETE /v1/api/houses/:houseId/videos/:filename
```

**Headers:**
```
Authorization: Bearer <token>
```

**Parameters:**
- `houseId` (path): ID ของบ้าน
- `filename` (path): ชื่อไฟล์วิดีโอ

**Response Success (200):**
```json
{
  "success": true,
  "message": "ลบวิดีโอสำเร็จ"
}
```

## การใช้งาน

### JavaScript/Fetch Example
```javascript
// อัปโหลดวิดีโอ
const formData = new FormData();
formData.append('videos', videoFile1);
formData.append('videos', videoFile2);
formData.append('quality', 'medium');

const response = await fetch('/v1/api/houses/house123/videos', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token
  },
  body: formData
});

const result = await response.json();
```

### cURL Example
```bash
# อัปโหลดวิดีโอ
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "videos=@video1.mp4" \
  -F "videos=@video2.mp4" \
  -F "quality=medium" \
  http://localhost:4000/v1/api/houses/house123/videos

# ดึงรายการวิดีโอ
curl -X GET \
  http://localhost:4000/v1/api/houses/house123/videos

# ลบวิดีโอ
curl -X DELETE \
  -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:4000/v1/api/houses/house123/videos/video_1_1703123456789.mp4
```

## การบีบอัดวิดีโอ

### ตั้งค่าการบีบอัด
- **Low Quality**: Bitrate 500k, เหมาะสำหรับการแสดงตัวอย่าง
- **Medium Quality**: Bitrate 1000k, สมดุลระหว่างคุณภาพและขนาดไฟล์
- **High Quality**: Bitrate 2000k, คุณภาพสูงสุด

### การปรับแต่งเพิ่มเติม
- ความละเอียดสูงสุด: 1920x1080 (Full HD)
- Frame rate: 30 FPS
- Video codec: H.264 (libx264)
- Audio codec: AAC
- Format: MP4 พร้อม fast start สำหรับ streaming

## ข้อจำกัด

### ขนาดไฟล์
- ไฟล์เดี่ยว: สูงสุด 500MB
- จำนวนไฟล์: สูงสุด 5 ไฟล์ต่อครั้ง

### สิทธิ์การเข้าถึง
- **อัปโหลด/ลบ**: เฉพาะเจ้าของบ้าน, Admin, Moderator
- **ดูรายการ**: ทุกคน

### ประสิทธิภาพ
- การบีบอัดใช้เวลาขึ้นอยู่กับขนาดและความยาวของวิดีโอ
- ระบบจะประมวลผลทีละไฟล์เพื่อป้องกันการใช้ทรัพยากรมากเกินไป

## Error Codes

| Code | Message | คำอธิบาย |
|------|---------|----------|
| 400 | ไฟล์วิดีโอมีขนาดใหญ่เกินไป | ไฟล์เกิน 500MB |
| 400 | จำนวนไฟล์วิดีโอเกินกำหนด | อัปโหลดเกิน 5 ไฟล์ |
| 400 | รองรับเฉพาะไฟล์วิดีโอ | ไฟล์ไม่ใช่วิดีโอ |
| 401 | ไม่ได้รับอนุญาต | ไม่มี token หรือ token หมดอายุ |
| 403 | คุณไม่มีสิทธิ์ | ไม่ใช่เจ้าของบ้านหรือ Admin |
| 404 | ไม่พบข้อมูลบ้าน | House ID ไม่ถูกต้อง |
| 500 | การบีบอัดวิดีโอล้มเหลว | ปัญหาการประมวลผลวิดีโอ |

## ทดสอบ API

1. เปิดไฟล์ `backend/docs/house-video-upload-example.html` ในเบราว์เซอร์
2. ใส่ JWT token และ House ID
3. เลือกไฟล์วิดีโอและคุณภาพการบีบอัด
4. กดอัปโหลดและรอผลลัพธ์

## โครงสร้างไฟล์

```
uploads/
└── videos/
    └── [houseId]/
        ├── video_1_[timestamp].mp4
        ├── video_2_[timestamp].mp4
        └── ...
```

## การบำรุงรักษา

### การลบไฟล์อัตโนมัติ
- เมื่อลบบ้าน ระบบจะลบโฟลเดอร์วิดีโอทั้งหมดของบ้านนั้น
- เมื่อลบวิดีโอเฉพาะไฟล์ จะลบเฉพาะไฟล์ที่เลือก

### การตรวจสอบพื้นที่
- ควรตรวจสอบพื้นที่ดิสก์เป็นประจำ
- พิจารณาใช้ cloud storage สำหรับไฟล์วิดีโอขนาดใหญ่