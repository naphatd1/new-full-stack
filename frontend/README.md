# HouseMarket Frontend

แพลตฟอร์มซื้อขายบ้านออนไลน์ที่สร้างด้วย Next.js, TypeScript และ Tailwind CSS

## ✨ Features

### 🏠 หน้าแรก (Homepage)
- Hero section พร้อม call-to-action
- ตัวกรองการค้นหาแบบขั้นสูง
- แสดงบ้านแนะนำ
- ส่วนแสดงจุดเด่นของเว็บไซต์

### 🔍 ค้นหาบ้าน (Search)
- ระบบค้นหาและกรองข้อมูลแบบละเอียด
- การเรียงลำดับผลการค้นหา
- Pagination สำหรับผลการค้นหา
- แสดงผลแบบ grid layout

### 🏡 รายละเอียดบ้าน (House Details)
- แสดงรูปภาพแบบ gallery
- ข้อมูลครบถ้วนของบ้าน
- ข้อมูลติดต่อเจ้าของ
- การแชร์และบันทึกรายการโปรด

### 📝 ลงขายบ้าน (Create Listing)
- ฟอร์มลงประกาศที่ครบถ้วน
- อัพโหลดรูปภาพหลายรูป
- ตัวอย่างรูปภาพแบบ real-time
- การตรวจสอบข้อมูลก่อนส่ง

### 👤 โปรไฟล์ผู้ใช้ (User Profile)
- จัดการข้อมูลส่วนตัว
- แก้ไขโปรไฟล์
- การตั้งค่าบัญชี

### 🏠 บ้านของฉัน (My Houses)
- จัดการประกาศของตัวเอง
- สถิติการขาย
- แก้ไข/ลบประกาศ

### 🔐 Authentication
- เข้าสู่ระบบ/สมัครสมาชิก
- JWT token management
- Protected routes

## 🛠 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **HTTP Client**: Axios
- **State Management**: React Context
- **Notifications**: React Hot Toast
- **Image Handling**: Next.js Image component

## 📁 Project Structure

```
src/
├── app/                    # App Router pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── login/             # Login page
│   ├── register/          # Register page
│   ├── search/            # Search page
│   ├── profile/           # Profile page
│   ├── my-houses/         # User's houses
│   └── houses/
│       ├── create/        # Create house listing
│       └── [id]/          # House details
├── components/
│   ├── ui/                # Reusable UI components
│   ├── layout/            # Layout components
│   └── houses/            # House-specific components
├── contexts/              # React contexts
├── lib/                   # Utilities and API
└── types/                 # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm หรือ yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.local.example .env.local
```

4. Configure environment variables in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

5. Start development server
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## 📱 Responsive Design

เว็บไซต์รองรับการใช้งานบนอุปกรณ์ทุกขนาด:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)
- 🖥 Large Desktop (1280px+)

## 🎨 UI Components

### Button Component
```tsx
<Button variant="primary" size="lg" loading={isLoading}>
  ส่งข้อมูล
</Button>
```

### Input Component
```tsx
<Input
  label="ชื่อบ้าน"
  error={errors.title}
  placeholder="กรอกชื่อบ้าน"
/>
```

### Card Component
```tsx
<Card>
  <CardHeader>
    <CardTitle>หัวข้อ</CardTitle>
  </CardHeader>
  <CardContent>
    เนื้อหา
  </CardContent>
</Card>
```

## 🔧 API Integration

### Authentication
```typescript
// Login
const response = await authApi.login({ email, password });

// Register
const response = await authApi.register(userData);

// Get Profile
const response = await authApi.getProfile();
```

### Houses
```typescript
// Get houses with filters
const response = await housesApi.getHouses({
  city: 'กรุงเทพ',
  minPrice: 1000000,
  maxPrice: 5000000
});

// Get house details
const response = await housesApi.getHouse(houseId);

// Create house
const formData = new FormData();
// ... add form data and images
const response = await housesApi.createHouse(formData);
```

## 🎯 Key Features Implementation

### Image Upload
- รองรับการอัพโหลดหลายรูป
- แสดงตัวอย่างรูปแบบ real-time
- จำกัดขนาดและประเภทไฟล์
- รูปแรกเป็นรูปหลักอัตโนมัติ

### Search & Filters
- ค้นหาตามเมือง, จังหวัด, ประเภทบ้าน
- กรองตามราคา, จำนวนห้อง, พื้นที่
- เรียงลำดับผลการค้นหา
- Pagination แบบ server-side

### Authentication Flow
- JWT token storage ใน cookies
- Auto-redirect สำหรับ protected routes
- Token refresh handling
- Logout ทุก tabs พร้อมกัน

## 🔒 Security Features

- XSS protection
- CSRF protection
- Input validation
- Image upload security
- JWT token management
- Protected API routes

## 📊 Performance Optimizations

- Next.js Image optimization
- Code splitting
- Lazy loading
- Bundle optimization
- Caching strategies

## 🌐 Internationalization

เว็บไซต์รองรับภาษาไทยเป็นหลัก พร้อมโครงสร้างสำหรับเพิ่มภาษาอื่น

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables for Production
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
```

## 🤝 Contributing

1. Fork the project
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

หากมีคำถามหรือต้องการความช่วยเหลือ:
- Email: support@housemarket.com
- GitHub Issues: [Create an issue](https://github.com/your-repo/issues)

---

Made with ❤️ for the Thai real estate market