# House Management API

ระบบจัดการบ้านและรูปภาพแบบ Production ด้วย Express.js, TypeScript และ Prisma รองรับการอัปโหลดรูปภาพหลายรูปพร้อมการบีบอัด

## 🚀 Recent Updates

- ✅ **เพิ่มระบบจัดการบ้าน** - สร้าง แก้ไข ลบ และค้นหาบ้าน
- ✅ **ระบบอัปโหลดรูปภาพหลายรูป** - รองรับสูงสุด 30 รูปต่อบ้าน
- ✅ **การบีบอัดรูปภาพอัตโนมัติ** - ด้วย Sharp (JPEG quality 85%, max 1920x1080)
- ✅ **จัดเก็บแยก Folder** - แต่ละบ้านมี folder แยกกัน
- ✅ **จัดการรูปภาพ** - ตั้งรูปหลัก จัดเรียงลำดับ ลบรูป

## 🚀 Features

### Authentication & User Management
- ✅ Authentication & Authorization (JWT)
- ✅ User Registration & Login
- ✅ **Password Hashing (Argon2)** - อัปเกรดจาก bcrypt
- ✅ Role-based Access Control (USER, MODERATOR, ADMIN)
- ✅ Rate Limiting
- ✅ Input Validation
- ✅ Session Management

### House Management
- ✅ **CRUD Operations** - สร้าง อ่าน แก้ไข ลบบ้าน
- ✅ **Advanced Filtering** - กรองตามราคา ที่อยู่ ประเภทบ้าน
- ✅ **House Types** - บ้านเดี่ยว ทาวน์เฮาส์ คอนโด อพาร์ทเมนท์
- ✅ **Status Management** - พร้อมขาย รอการตัดสินใจ ขายแล้ว
- ✅ **Owner Authorization** - เฉพาะเจ้าของเท่านั้นที่แก้ไขได้

### Image Management
- ✅ **Multi-Image Upload** - อัปโหลดได้สูงสุด 30 รูปต่อบ้าน
- ✅ **Image Compression** - บีบอัดอัตโนมัติด้วย Sharp
- ✅ **Folder Organization** - แยก folder ตามแต่ละบ้าน
- ✅ **Main Image Setting** - ตั้งรูปหลักได้
- ✅ **Image Reordering** - จัดเรียงลำดับรูปภาพ
- ✅ **File Validation** - ตรวจสอบประเภทและขนาดไฟล์
- ✅ Profile Management
- ✅ Database with Prisma ORM
- ✅ TypeScript Support
- ✅ **Function-based Architecture** - เปลี่ยนจาก Class-based
- ✅ **Image Upload System** - Base64 และ File upload พร้อม image processing
- ✅ Security Best Practices

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL Database
- npm หรือ yarn

## 🛠️ Installation

1. **Clone และติดตั้ง dependencies:**

```bash
npm install
```

2. **ตั้งค่า Environment Variables:**

```bash
cp .env.example .env
```

แก้ไขไฟล์ `.env`:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/myapp_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

3. **Setup Database:**

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database with test data
npm run db:seed
```

4. **Start Development Server:**

```bash
npm run dev
```

## 📚 API Endpoints

### Authentication

| Method | Endpoint                    | Description     | Access    |
| ------ | --------------------------- | --------------- | --------- |
| POST   | `/v1/api/auth/register`        | สมัครสมาชิก     | Public    |
| POST   | `/v1/api/auth/login`           | เข้าสู่ระบบ     | Public    |
| POST   | `/v1/api/auth/logout`          | ออกจากระบบ      | Protected |
| POST   | `/v1/api/auth/refresh-token`   | รีเฟรช Token    | Protected |
| POST   | `/v1/api/auth/change-password` | เปลี่ยนรหัสผ่าน | Protected |
| GET    | `/v1/api/auth/sessions`        | ดู Sessions     | Protected |
| DELETE | `/v1/api/auth/sessions/:id`    | ลบ Session      | Protected |

### User Management

| Method | Endpoint                          | Description          | Access          |
| ------ | --------------------------------- | -------------------- | --------------- |
| GET    | `/v1/api/users/profile`           | ดูโปรไฟล์ตัวเอง      | Protected       |
| PUT    | `/v1/api/users/profile`           | แก้ไขโปรไฟล์         | Protected       |
| GET    | `/v1/api/users`                   | ดูผู้ใช้ทั้งหมด      | Admin/Moderator |
| GET    | `/v1/api/users/:id`               | ดูผู้ใช้ตาม ID       | Admin/Moderator |
| PATCH  | `/v1/api/users/:id/toggle-status` | เปิด/ปิดใช้งานผู้ใช้ | Admin           |
| DELETE | `/v1/api/users/:id`               | ลบผู้ใช้             | Admin           |

### Image Upload

| Method | Endpoint                    | Description        | Access    |
| ------ | --------------------------- | ------------------ | --------- |
| POST   | `/v1/api/upload/avatar`     | อัปโหลดรูปโปรไฟล์   | Protected |
| DELETE | `/v1/api/upload/avatar`     | ลบรูปโปรไฟล์       | Protected |
| POST   | `/v1/api/upload/image`      | อัปโหลดรูปภาพทั่วไป | Protected |

## 🔐 Authentication

ใช้ JWT Token ในการ Authentication:

```bash
Authorization: Bearer <your-jwt-token>
```

## 📝 API Examples

### Register

```bash
POST /v1/api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "password": "Password123!@#",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Login

```bash
POST /v1/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!@#"
}
```

### Get Profile

```bash
GET /v1/api/users/profile
Authorization: Bearer <jwt-token>
```

### Update Profile

```bash
PUT /v1/api/users/profile
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Smith",
  "bio": "Software Developer",
  "phone": "0812345678",
  "city": "Bangkok",
  "country": "Thailand"
}
```

### Upload Avatar (Base64)

```bash
POST /v1/api/upload/avatar
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "avatar": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD..."
}
```

### Upload Avatar (File)

```bash
POST /v1/api/upload/avatar
Authorization: Bearer <jwt-token>
Content-Type: multipart/form-data

# Form data with file field named 'avatar'
```

## 🔒 Security Features

- **Password Hashing**: **Argon2** (อัปเกรดจาก bcrypt) - ความปลอดภัยระดับสูง
- **JWT Tokens**: Secure token-based authentication
- **Rate Limiting**: API และ Auth endpoints
- **Input Validation**: express-validator
- **Security Headers**: Helmet.js
- **CORS Protection**: Configurable CORS
- **SQL Injection Protection**: Prisma ORM
- **Function-based Architecture**: ประสิทธิภาพและความปลอดภัยที่ดีขึ้น

## 🎭 User Roles

- **USER**: ผู้ใช้ทั่วไป - จัดการโปรไฟล์ตัวเอง
- **MODERATOR**: ผู้ดูแล - ดูข้อมูลผู้ใช้
- **ADMIN**: ผู้ดูแลระบบ - จัดการผู้ใช้ทั้งหมด

## 🧪 Test Accounts

หลังจากรัน `npm run db:seed`:

- **Admin**: `admin@example.com` / `Admin123!@#`
- **Moderator**: `moderator@example.com` / `Moderator123!@#`
- **Users**: `user1@example.com` ถึง `user5@example.com` / `User[N]123!@#`

## 🗄️ Database Schema

```prisma
model User {
  id         String   @id @default(cuid())
  email      String   @unique
  username   String   @unique
  password   String
  firstName  String?
  lastName   String?
  avatar     String?
  role       Role     @default(USER)
  isActive   Boolean  @default(true)
  isVerified Boolean  @default(false)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  sessions   Session[]
  profile    Profile?
}

model Profile {
  id          String    @id @default(cuid())
  userId      String    @unique
  bio         String?
  phone       String?
  dateOfBirth DateTime?
  address     String?
  city        String?
  country     String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  user User @relation(fields: [userId], references: [id])
}

enum Role {
  USER
  ADMIN
  MODERATOR
}
```

## 🚀 Production Deployment

1. **Environment Variables**:

```env
NODE_ENV=production
DATABASE_URL="your-production-database-url"
JWT_SECRET="your-super-secure-jwt-secret"
```

2. **Build**:

```bash
npm run build
npm start
```

3. **Database Migration**:

```bash
npm run db:migrate
```

## 📊 Monitoring

- Health Check: `GET /health`
- API Documentation: `GET /v1/api`
- Swagger Documentation: `GET /v1/api-docs`
- Database Studio: `npm run db:studio`

## 📖 API Documentation

### Swagger/OpenAPI Documentation
- **Swagger UI**: `http://localhost:4000/v1/api-docs`
- **JSON Spec**: `http://localhost:4000/v1/api-docs.json`
- **Guide**: `docs/swagger-guide.md`

### Features
- ✅ Interactive API testing
- ✅ Complete endpoint documentation
- ✅ Built-in JWT authentication
- ✅ Request/response examples
- ✅ Schema validation
- ✅ Error response documentation
- ✅ Image upload documentation

## 📮 Postman Collection

Complete Postman collection พร้อมใช้งานใน directory `postman/`:

- **Collection**: `postman/User-Management-API.postman_collection.json`
- **Environment**: `postman/User-Management-API.postman_environment.json`
- **Documentation**: `postman/README.md`
- **Test Scenarios**: `postman/test-scenarios.md`

### 🚀 Quick Import

1. เปิด Postman
2. Import ไฟล์ JSON ทั้งสองจาก `postman/` directory
3. เลือก "User Management API Environment"
4. เริ่มทดสอบได้เลย!

### ✨ Features

- ✅ Auto JWT token management
- ✅ ครอบคลุม API ทั้งหมด
- ✅ Test scenarios รวมอยู่ด้วย
- ✅ Environment variables ตั้งค่าแล้ว
- ✅ ตัวอย่าง Error handling

### 🧪 Test Accounts

หลังจากรัน `npm run db:seed`:

- **Admin**: `admin@example.com` / `Admin123!@#`
- **Moderator**: `moderator@example.com` / `Moderator123!@#`
- **User**: `user1@example.com` / `User1123!@#`

## 🤝 Contributing

1. Fork the project
2. Create feature branch
3. Commit changes
4. Push to branch
5. Test with Postman collection
6. Open Pull Request
