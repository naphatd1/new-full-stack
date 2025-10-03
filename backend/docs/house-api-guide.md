# คู่มือการใช้งาน House API

## ภาพรวม
API สำหรับจัดการข้อมูลบ้านและรูปภาพ รองรับการอัปโหลดรูปภาพหลายรูปพร้อมการบีบอัดและจัดเก็บแยกตาม folder ของแต่ละบ้าน

## คุณสมบัติหลัก
- ✅ อัปโหลดรูปภาพได้สูงสุด 30 รูปต่อบ้าน
- ✅ บีบอัดรูปภาพอัตโนมัติ (JPEG quality 85%, max 1920x1080)
- ✅ จัดเก็บรูปภาพแยก folder ตามแต่ละบ้าน
- ✅ ตั้งรูปหลักและจัดเรียงลำดับรูปภาพ
- ✅ กรองและค้นหาบ้านตามเงื่อนไขต่างๆ
- ✅ ระบบ authentication และ authorization

## การติดตั้งและเตรียมพร้อม

### 1. อัปเดต Database Schema
```bash
npx prisma db push
```

### 2. สร้างโฟลเดอร์สำหรับเก็บรูปภาพ
```bash
mkdir -p uploads/houses
```

## API Endpoints

### บ้าน (Houses)

#### 1. สร้างบ้านใหม่
```http
POST /v1/api/houses
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "บ้านเดี่ยว 2 ชั้น ย่านสุขุมวิท",
  "description": "บ้านสวยพร้อมอยู่ ใกล้ BTS",
  "price": 15000000,
  "address": "123/45 ซอยสุขุมวิท 21",
  "city": "วัฒนา",
  "province": "กรุงเทพมหานคร",
  "postalCode": "10110",
  "bedrooms": 3,
  "bathrooms": 2,
  "area": 150.5,
  "landArea": 200,
  "houseType": "DETACHED_HOUSE"
}
```

#### 2. ดูรายการบ้านทั้งหมด (มีการกรอง)
```http
GET /v1/api/houses?city=วัฒนา&minPrice=10000000&maxPrice=20000000&houseType=DETACHED_HOUSE
```

#### 3. ดูรายการบ้านของฉัน
```http
GET /v1/api/houses/my
Authorization: Bearer <token>
```

#### 4. ดูข้อมูลบ้านตาม ID
```http
GET /v1/api/houses/{houseId}
```

#### 5. แก้ไขข้อมูลบ้าน
```http
PUT /v1/api/houses/{houseId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "บ้านเดี่ยว 2 ชั้น ย่านสุขุมวิท (ปรับปรุงใหม่)",
  "price": 16000000,
  "status": "AVAILABLE"
}
```

#### 6. ลบบ้าน
```http
DELETE /v1/api/houses/{houseId}
Authorization: Bearer <token>
```

### รูปภาพบ้าน (House Images)

#### 1. อัปโหลดรูปภาพบ้าน (หลายรูป)
```http
POST /v1/api/houses/{houseId}/images
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- images: [file1.jpg, file2.jpg, file3.jpg, ...] (สูงสุด 30 ไฟล์)
```

**ตัวอย่างการใช้งานด้วย JavaScript:**
```javascript
const formData = new FormData();
const files = document.getElementById('imageInput').files;

// เพิ่มไฟล์ทั้งหมดลงใน FormData
for (let i = 0; i < files.length; i++) {
  formData.append('images', files[i]);
}

fetch('/v1/api/houses/house123/images', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token
  },
  body: formData
})
.then(response => response.json())
.then(data => console.log(data));
```

#### 2. ดูรายการรูปภาพของบ้าน
```http
GET /v1/api/houses/{houseId}/images
```

#### 3. ตั้งรูปหลัก
```http
PUT /v1/api/houses/{houseId}/images/{imageId}/main
Authorization: Bearer <token>
```

#### 4. จัดเรียงลำดับรูปภาพ
```http
PUT /v1/api/houses/{houseId}/images/reorder
Authorization: Bearer <token>
Content-Type: application/json

{
  "imageOrders": [
    { "id": "img1", "order": 0 },
    { "id": "img2", "order": 1 },
    { "id": "img3", "order": 2 }
  ]
}
```

#### 5. ลบรูปภาพ
```http
DELETE /v1/api/houses/{houseId}/images/{imageId}
Authorization: Bearer <token>
```

## ประเภทบ้าน (House Types)
- `DETACHED_HOUSE` - บ้านเดี่ยว
- `TOWNHOUSE` - ทาวน์เฮาส์
- `CONDO` - คอนโด
- `APARTMENT` - อพาร์ทเมนท์
- `COMMERCIAL` - อาคารพาณิชย์
- `LAND` - ที่ดิน

## สถานะบ้าน (House Status)
- `AVAILABLE` - พร้อมขาย
- `PENDING` - รอการตัดสินใจ
- `SOLD` - ขายแล้ว
- `INACTIVE` - ไม่ใช้งาน

## การจัดการรูปภาพ

### ข้อกำหนดรูปภาพ
- **รูปแบบที่รองรับ:** JPEG, PNG, WebP, GIF
- **ขนาดไฟล์สูงสุด:** 10MB ต่อไฟล์
- **จำนวนไฟล์สูงสุด:** 30 ไฟล์ต่อบ้าน
- **จำนวนไฟล์ขั้นต่ำ:** 5 ไฟล์ต่อบ้าน

### การบีบอัดรูปภาพ
- **ขนาดสูงสุด:** 1920x1080 pixels
- **คุณภาพ:** 85% (JPEG)
- **รูปแบบผลลัพธ์:** JPEG
- **Progressive JPEG:** เปิดใช้งาน

### โครงสร้างโฟลเดอร์
```
uploads/
└── houses/
    ├── house-id-1/
    │   ├── image1_timestamp.jpg
    │   ├── image2_timestamp.jpg
    │   └── ...
    ├── house-id-2/
    │   ├── image1_timestamp.jpg
    │   └── ...
    └── ...
```

### URL การเข้าถึงรูปภาพ
```
http://localhost:4000/uploads/houses/{houseId}/{filename}
```

## ตัวอย่างการใช้งานแบบเต็ม

### 1. สร้างบ้านและอัปโหลดรูปภาพ
```javascript
// 1. สร้างบ้าน
const houseData = {
  title: "บ้านเดี่ยว 2 ชั้น ย่านสุขุมวิท",
  description: "บ้านสวยพร้อมอยู่ ใกล้ BTS",
  price: 15000000,
  address: "123/45 ซอยสุขุมวิท 21",
  city: "วัฒนา",
  province: "กรุงเทพมหานคร",
  bedrooms: 3,
  bathrooms: 2,
  area: 150.5,
  houseType: "DETACHED_HOUSE"
};

const houseResponse = await fetch('/v1/api/houses', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(houseData)
});

const house = await houseResponse.json();
const houseId = house.data.id;

// 2. อัปโหลดรูปภาพ
const formData = new FormData();
const files = document.getElementById('imageInput').files;

for (let i = 0; i < files.length; i++) {
  formData.append('images', files[i]);
}

const imageResponse = await fetch(`/v1/api/houses/${houseId}/images`, {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token
  },
  body: formData
});

const imageResult = await imageResponse.json();
console.log('อัปโหลดรูปภาพสำเร็จ:', imageResult);
```

### 2. ดึงข้อมูลบ้านพร้อมรูปภาพ
```javascript
const response = await fetch(`/v1/api/houses/${houseId}`);
const result = await response.json();

const house = result.data;
console.log('ข้อมูลบ้าน:', house);
console.log('รูปภาพทั้งหมด:', house.images);
console.log('รูปหลัก:', house.images.find(img => img.isMain));
```

## การจัดการข้อผิดพลาด

### ข้อผิดพลาดทั่วไป
- **400 Bad Request:** ข้อมูลไม่ถูกต้อง
- **401 Unauthorized:** ไม่ได้รับอนุญาต
- **403 Forbidden:** ไม่มีสิทธิ์เข้าถึง
- **404 Not Found:** ไม่พบข้อมูล
- **413 Payload Too Large:** ไฟล์ใหญ่เกินไป

### ตัวอย่าง Response ข้อผิดพลาด
```json
{
  "success": false,
  "message": "ไฟล์มีขนาดใหญ่เกินไป (สูงสุด 10MB ต่อไฟล์)",
  "errors": [
    {
      "field": "images",
      "message": "ไฟล์ house1.jpg มีขนาด 15MB เกินกำหนด"
    }
  ]
}
```

## เคล็ดลับการใช้งาน

### 1. การอัปโหลดรูปภาพที่มีประสิทธิภาพ
- ใช้ `Promise.all()` สำหรับการอัปโหลดหลายไฟล์
- แสดง progress bar ระหว่างการอัปโหลด
- ตรวจสอบขนาดไฟล์ก่อนอัปโหลด

### 2. การจัดการรูปภาพ
- ตั้งรูปหลักที่สวยที่สุดเป็นรูปแรก
- จัดเรียงรูปภาพตามลำดับที่ต้องการแสดง
- ใช้รูปภาพที่มีคุณภาพดีและแสงสว่างเพียงพอ

### 3. การค้นหาและกรอง
- ใช้ query parameters สำหรับการกรอง
- รวมหลายเงื่อนไขการกรองได้
- ใช้ pagination สำหรับข้อมูลจำนวนมาก

## การทดสอบ API

### ใช้ Postman
1. Import collection จาก `postman/User-Management-API.postman_collection.json`
2. ตั้งค่า environment variables
3. ทดสอบ endpoints ตามลำดับ

### ใช้ curl
```bash
# สร้างบ้าน
curl -X POST http://localhost:4000/v1/api/houses \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"บ้านทดสอบ","price":5000000,"address":"123 ถนนทดสอบ","city":"กรุงเทพ","province":"กรุงเทพมหานคร","bedrooms":2,"bathrooms":1,"area":100,"houseType":"DETACHED_HOUSE"}'

# อัปโหลดรูปภาพ
curl -X POST http://localhost:4000/v1/api/houses/HOUSE_ID/images \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "images=@image1.jpg" \
  -F "images=@image2.jpg"
```