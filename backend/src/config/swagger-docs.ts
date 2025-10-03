/**
 * Centralized Swagger Documentation
 * รวม API Documentation ทั้งหมดไว้ที่เดียว
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: API root endpoint
 *     tags: [System]
 *     responses:
 *       200:
 *         description: API root information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: สวัสดี! User Management API กำลังทำงาน!
 *                 timestamp:
 *                   type: string
 *                   example: 19/12/2567 19:30:00
 *                 timezone:
 *                   type: string
 *                   example: Asia/Bangkok
 *                 version:
 *                   type: string
 *                   example: 2.0.0
 *                 documentation:
 *                   type: string
 *                   example: /v1/api
 *                 swagger:
 *                   type: string
 *                   example: /v1/api-docs
 */

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [System]
 *     responses:
 *       200:
 *         description: API health status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 uptime:
 *                   type: string
 *                   example: 3600 วินาที
 *                 timestamp:
 *                   type: string
 *                   example: 19/12/2567 19:30:00
 *                 timezone:
 *                   type: string
 *                   example: Asia/Bangkok
 */

/**
 * @swagger
 * /api:
 *   get:
 *     summary: API information endpoint
 *     tags: [System]
 *     responses:
 *       200:
 *         description: API information and available endpoints
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User Management API v2.0.0
 *                 endpoints:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["/auth", "/users", "/upload"]
 *                 documentation:
 *                   type: string
 *                   example: /v1/api-docs
 */
// =
//=================== Authentication Endpoints ====================

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - username
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 30
 *                 pattern: '^[a-zA-Z0-9_]+'
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]'
 *                 example: Password123!@#
 *               firstName:
 *                 type: string
 *                 maxLength: 50
 *                 example: John
 *               lastName:
 *                 type: string
 *                 maxLength: 50
 *                 example: Doe
 *               role:
 *                 type: string
 *                 enum: [USER, MODERATOR, ADMIN]
 *                 default: USER
 *                 description: User role (optional, defaults to USER)
 *                 example: USER
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Email or username already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       429:
 *         description: Too many registration attempts
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: Password123!@#
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       429:
 *         description: Too many login attempts
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout current session
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh JWT token
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: รีเฟรช Token สำเร็จ
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     expiresIn:
 *                       type: string
 *                       example: 7d
 *       401:
 *         description: Unauthorized or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     summary: Change user password
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: OldPassword123!
 *               newPassword:
 *                 type: string
 *                 minLength: 8
 *                 pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]'
 *                 example: NewPassword123!@#
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Validation error or incorrect current password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/auth/sessions:
 *   get:
 *     summary: Get user active sessions
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sessions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Session'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/auth/sessions/{sessionId}:
 *   delete:
 *     summary: Delete a specific session
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Session ID to delete
 *     responses:
 *       200:
 *         description: Session deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Session not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */ //
// ==================== User Profile Endpoints ====================

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [User Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update current user profile
 *     tags: [User Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 maxLength: 50
 *                 example: John
 *               lastName:
 *                 type: string
 *                 maxLength: 50
 *                 example: Smith
 *               bio:
 *                 type: string
 *                 maxLength: 500
 *                 example: Software Developer with 5+ years experience
 *               phone:
 *                 type: string
 *                 pattern: '^[0-9+\-\s()]+'
 *                 example: +66812345678
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: 1990-01-15
 *               address:
 *                 type: string
 *                 example: 123 Main Street
 *               city:
 *                 type: string
 *                 example: Bangkok
 *               country:
 *                 type: string
 *                 example: Thailand
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: อัปเดตโปรไฟล์สำเร็จ
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

// ==================== User Management Endpoints ====================

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (Admin/Moderator only)
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of users per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by email, username, firstName, or lastName
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [USER, MODERATOR, ADMIN]
 *         description: Filter by user role
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by account status
 *       - in: query
 *         name: isVerified
 *         schema:
 *           type: boolean
 *         description: Filter by verification status
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginationResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID (Admin/Moderator only)
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/users/{id}/toggle-status:
 *   patch:
 *     summary: Toggle user active status (Admin/Moderator only)
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: เปลี่ยนสถานะผู้ใช้สำเร็จ
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user (Admin only)
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Insufficient permissions (Admin only)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */ // =
// =================== Upload Endpoints ====================

/**
 * @swagger
 * /api/upload/avatar:
 *   post:
 *     summary: Upload user avatar (file or base64)
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Image file (jpg, jpeg, png, gif, webp)
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 description: Base64 encoded image
 *                 example: data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD...
 *     responses:
 *       200:
 *         description: Avatar uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: อัปโหลดรูปโปรไฟล์สำเร็จ
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     imageInfo:
 *                       type: object
 *                       properties:
 *                         size:
 *                           type: number
 *                           example: 245760
 *                         originalName:
 *                           type: string
 *                           example: avatar.jpg
 *                         processedFormat:
 *                           type: string
 *                           example: JPEG
 *       400:
 *         description: Invalid image or validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/upload/avatar:
 *   delete:
 *     summary: Delete user avatar
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Avatar deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: ลบรูปโปรไฟล์สำเร็จ
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: No avatar to delete
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/upload/image:
 *   post:
 *     summary: Upload general image (file or base64)
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file (jpg, jpeg, png, gif, webp)
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 description: Base64 encoded image
 *                 example: data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD...
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: อัปโหลดรูปภาพสำเร็จ
 *                 data:
 *                   type: object
 *                   properties:
 *                     imageUrl:
 *                       type: string
 *                       example: /uploads/images/1234567890-image.jpg
 *                     imageInfo:
 *                       type: object
 *                       properties:
 *                         size:
 *                           type: number
 *                           example: 245760
 *                         originalName:
 *                           type: string
 *                           example: image.jpg
 *                         processedFormat:
 *                           type: string
 *                           example: JPEG
 *       400:
 *         description: Invalid image or validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */ //
// ==================== House Management Endpoints ====================

/**
 * @swagger
 * components:
 *   schemas:
 *     House:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique house identifier
 *           example: clp1234567890
 *         title:
 *           type: string
 *           description: House title
 *           example: Beautiful 2-bedroom house
 *         description:
 *           type: string
 *           description: House description
 *           example: A lovely house with garden
 *         price:
 *           type: number
 *           description: House price
 *           example: 5000000
 *         address:
 *           type: string
 *           description: House address
 *           example: 123 Main Street, Bangkok
 *         bedrooms:
 *           type: integer
 *           description: Number of bedrooms
 *           example: 2
 *         bathrooms:
 *           type: integer
 *           description: Number of bathrooms
 *           example: 2
 *         area:
 *           type: number
 *           description: House area in square meters
 *           example: 120.5
 *         isAvailable:
 *           type: boolean
 *           description: Availability status
 *           example: true
 *         ownerId:
 *           type: string
 *           description: Owner user ID
 *           example: clp0987654321
 *         owner:
 *           $ref: '#/components/schemas/User'
 *         images:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/HouseImage'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     HouseImage:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Image identifier
 *         houseId:
 *           type: string
 *           description: Associated house ID
 *         imageUrl:
 *           type: string
 *           description: Image URL
 *           example: /uploads/houses/image.jpg
 *         isMain:
 *           type: boolean
 *           description: Main image flag
 *           example: false
 *         order:
 *           type: integer
 *           description: Display order
 *           example: 1
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/houses:
 *   post:
 *     summary: Create a new house listing
 *     tags: [House Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - price
 *               - address
 *               - bedrooms
 *               - bathrooms
 *               - area
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 200
 *                 example: Beautiful 2-bedroom house
 *               description:
 *                 type: string
 *                 maxLength: 2000
 *                 example: A lovely house with garden and modern amenities
 *               price:
 *                 type: number
 *                 minimum: 0
 *                 example: 5000000
 *               address:
 *                 type: string
 *                 maxLength: 500
 *                 example: 123 Main Street, Bangkok 10110
 *               bedrooms:
 *                 type: integer
 *                 minimum: 0
 *                 example: 2
 *               bathrooms:
 *                 type: integer
 *                 minimum: 0
 *                 example: 2
 *               area:
 *                 type: number
 *                 minimum: 0
 *                 example: 120.5
 *     responses:
 *       201:
 *         description: House created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: สร้างรายการบ้านสำเร็จ
 *                 data:
 *                   $ref: '#/components/schemas/House'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/houses:
 *   get:
 *     summary: Get all available houses
 *     tags: [House Management]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of houses per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by title, description, or address
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *       - in: query
 *         name: bedrooms
 *         schema:
 *           type: integer
 *         description: Number of bedrooms
 *       - in: query
 *         name: bathrooms
 *         schema:
 *           type: integer
 *         description: Number of bathrooms
 *     responses:
 *       200:
 *         description: Houses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     houses:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/House'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                           example: 1
 *                         limit:
 *                           type: integer
 *                           example: 10
 *                         total:
 *                           type: integer
 *                           example: 50
 *                         totalPages:
 *                           type: integer
 *                           example: 5
 */

/**
 * @swagger
 * /api/houses/my:
 *   get:
 *     summary: Get current user's houses
 *     tags: [House Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User houses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/House'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/houses/{id}:
 *   get:
 *     summary: Get house by ID
 *     tags: [House Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: House ID
 *     responses:
 *       200:
 *         description: House retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/House'
 *       404:
 *         description: House not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/houses/{id}:
 *   put:
 *     summary: Update house (Owner only)
 *     tags: [House Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: House ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 200
 *                 example: Updated house title
 *               description:
 *                 type: string
 *                 maxLength: 2000
 *                 example: Updated description
 *               price:
 *                 type: number
 *                 minimum: 0
 *                 example: 5500000
 *               address:
 *                 type: string
 *                 maxLength: 500
 *                 example: Updated address
 *               bedrooms:
 *                 type: integer
 *                 minimum: 0
 *                 example: 3
 *               bathrooms:
 *                 type: integer
 *                 minimum: 0
 *                 example: 2
 *               area:
 *                 type: number
 *                 minimum: 0
 *                 example: 130.5
 *               isAvailable:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: House updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: อัปเดตข้อมูลบ้านสำเร็จ
 *                 data:
 *                   $ref: '#/components/schemas/House'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Not the owner
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: House not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/houses/{id}:
 *   delete:
 *     summary: Delete house (Owner only)
 *     tags: [House Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: House ID
 *     responses:
 *       200:
 *         description: House deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: ลบรายการบ้านสำเร็จ
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Not the owner
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: House not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */ //
// ==================== House Image Management Endpoints ====================

/**
 * @swagger
 * /api/houses/{houseId}/images:
 *   post:
 *     summary: Upload house images
 *     tags: [House Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: houseId
 *         required: true
 *         schema:
 *           type: string
 *         description: House ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Image files (jpg, jpeg, png, gif, webp)
 *     responses:
 *       200:
 *         description: Images uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: อัปโหลดรูปภาพสำเร็จ
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/HouseImage'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Not the owner
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: House not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/houses/{houseId}/images:
 *   get:
 *     summary: Get house images
 *     tags: [House Management]
 *     parameters:
 *       - in: path
 *         name: houseId
 *         required: true
 *         schema:
 *           type: string
 *         description: House ID
 *     responses:
 *       200:
 *         description: Images retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/HouseImage'
 *       404:
 *         description: House not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/houses/{houseId}/images/{imageId}/main:
 *   put:
 *     summary: Set image as main (Owner only)
 *     tags: [House Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: houseId
 *         required: true
 *         schema:
 *           type: string
 *         description: House ID
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: string
 *         description: Image ID
 *     responses:
 *       200:
 *         description: Main image set successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: ตั้งเป็นรูปหลักสำเร็จ
 *                 data:
 *                   $ref: '#/components/schemas/HouseImage'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Not the owner
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: House or image not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/houses/{houseId}/images/reorder:
 *   put:
 *     summary: Reorder house images (Owner only)
 *     tags: [House Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: houseId
 *         required: true
 *         schema:
 *           type: string
 *         description: House ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - imageOrders
 *             properties:
 *               imageOrders:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     imageId:
 *                       type: string
 *                       example: clp1234567890
 *                     order:
 *                       type: integer
 *                       example: 1
 *                 example:
 *                   - imageId: clp1234567890
 *                     order: 1
 *                   - imageId: clp0987654321
 *                     order: 2
 *     responses:
 *       200:
 *         description: Images reordered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: เรียงลำดับรูปภาพสำเร็จ
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/HouseImage'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Not the owner
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: House not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/houses/{houseId}/images/{imageId}:
 *   delete:
 *     summary: Delete house image (Owner only)
 *     tags: [House Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: houseId
 *         required: true
 *         schema:
 *           type: string
 *         description: House ID
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: string
 *         description: Image ID
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: ลบรูปภาพสำเร็จ
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Not the owner
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: House or image not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
