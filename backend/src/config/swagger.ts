import swaggerJsdoc from "swagger-jsdoc";
import { SwaggerDefinition } from "swagger-jsdoc";

const swaggerDefinition: SwaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "User Management API",
    version: "2.0.0",
    description: `
      ระบบจัดการผู้ใช้แบบ Production ด้วย Express.js, TypeScript และ Prisma
      
      ## Features
      - 🔐 JWT Authentication & Authorization
      - 🔒 Argon2 Password Hashing
      - 👥 User Management (CRUD)
      - 🛡️ Role-based Access Control
      - 📊 User Profiles
      - 🚦 Rate Limiting
      - ✅ Input Validation
      - 🔄 Session Management
      
      ## Authentication
      Most endpoints require JWT authentication. Include the token in the Authorization header:
      \`Authorization: Bearer <your-jwt-token>\`
      
      ## Rate Limiting
      - General API: 100 requests per 15 minutes
      - Auth endpoints: 5 requests per 15 minutes  
      - Registration: 3 requests per hour
    `,
    contact: {
      name: "API Support",
      email: "support@example.com",
    },
    license: {
      name: "ISC",
    },
  },
  servers: [
    {
      url: "http://localhost:4000/v1",
      description: "Development server",
    },
    {
      url: "https://api.example.com/v1",
      description: "Production server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "JWT Authorization header using the Bearer scheme",
      },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Unique user identifier",
            example: "clp1234567890",
          },
          email: {
            type: "string",
            format: "email",
            description: "User email address",
            example: "user@example.com",
          },
          username: {
            type: "string",
            description: "Unique username",
            example: "johndoe",
          },
          firstName: {
            type: "string",
            description: "User first name",
            example: "John",
            nullable: true,
          },
          lastName: {
            type: "string",
            description: "User last name",
            example: "Doe",
            nullable: true,
          },
          avatar: {
            type: "string",
            description: "User avatar URL",
            example: "https://example.com/avatar.jpg",
            nullable: true,
          },
          role: {
            type: "string",
            enum: ["USER", "MODERATOR", "ADMIN"],
            description: "User role",
            example: "USER",
          },
          isActive: {
            type: "boolean",
            description: "User account status",
            example: true,
          },
          isVerified: {
            type: "boolean",
            description: "Email verification status",
            example: false,
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "Account creation timestamp",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            description: "Last update timestamp",
          },
          profile: {
            $ref: "#/components/schemas/Profile",
          },
        },
      },
      Profile: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Profile identifier",
          },
          userId: {
            type: "string",
            description: "Associated user ID",
          },
          bio: {
            type: "string",
            description: "User biography",
            example: "Software Developer with 5+ years experience",
            nullable: true,
          },
          phone: {
            type: "string",
            description: "Phone number",
            example: "+66812345678",
            nullable: true,
          },
          dateOfBirth: {
            type: "string",
            format: "date",
            description: "Date of birth",
            example: "1990-01-15",
            nullable: true,
          },
          address: {
            type: "string",
            description: "Street address",
            example: "123 Main Street",
            nullable: true,
          },
          city: {
            type: "string",
            description: "City",
            example: "Bangkok",
            nullable: true,
          },
          country: {
            type: "string",
            description: "Country",
            example: "Thailand",
            nullable: true,
          },
          createdAt: {
            type: "string",
            format: "date-time",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
          },
        },
      },
      Session: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Session identifier",
          },
          userId: {
            type: "string",
            description: "Associated user ID",
          },
          token: {
            type: "string",
            description: "Session token",
          },
          expiresAt: {
            type: "string",
            format: "date-time",
            description: "Session expiration time",
          },
          userAgent: {
            type: "string",
            description: "User agent string",
            nullable: true,
          },
          ipAddress: {
            type: "string",
            description: "IP address",
            nullable: true,
          },
          createdAt: {
            type: "string",
            format: "date-time",
          },
        },
      },
      AuthResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: true,
          },
          message: {
            type: "string",
            example: "เข้าสู่ระบบสำเร็จ",
          },
          data: {
            type: "object",
            properties: {
              user: {
                allOf: [
                  { $ref: "#/components/schemas/User" },
                  {
                    type: "object",
                    description: "User object without password field",
                  },
                ],
              },
              token: {
                type: "string",
                description: "JWT access token",
                example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
              },
              expiresIn: {
                type: "string",
                description: "Token expiration time",
                example: "7d",
              },
            },
          },
        },
      },
      SuccessResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: true,
          },
          message: {
            type: "string",
            example: "Operation completed successfully",
          },
          data: {
            type: "object",
            description: "Response data (varies by endpoint)",
          },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: false,
          },
          message: {
            type: "string",
            example: "Error occurred",
          },
          errors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                field: {
                  type: "string",
                  example: "email",
                },
                message: {
                  type: "string",
                  example: "กรุณาใส่อีเมลที่ถูกต้อง",
                },
              },
            },
            description: "Validation errors (if any)",
          },
        },
      },
      PaginationResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: true,
          },
          data: {
            type: "object",
            properties: {
              users: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/User",
                },
              },
              pagination: {
                type: "object",
                properties: {
                  page: {
                    type: "integer",
                    example: 1,
                  },
                  limit: {
                    type: "integer",
                    example: 10,
                  },
                  total: {
                    type: "integer",
                    example: 50,
                  },
                  totalPages: {
                    type: "integer",
                    example: 5,
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  tags: [
    {
      name: "Authentication",
      description: "User authentication and authorization endpoints",
    },
    {
      name: "User Profile",
      description: "User profile management endpoints",
    },
    {
      name: "User Management",
      description:
        "Admin user management endpoints (Admin/Moderator access required)",
    },
    {
      name: "House Management",
      description: "House listing and image management endpoints",
    },
    {
      name: "Upload",
      description: "Image upload and management endpoints",
    },
    {
      name: "System",
      description: "System health and information endpoints",
    },
  ],
};

const options = {
  definition: swaggerDefinition,
  apis: [
    "./src/config/swagger-docs.ts", // All API documentation in one place
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
