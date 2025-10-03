# Swagger API Documentation Guide

This guide explains how to use the Swagger/OpenAPI documentation for the User Management API.

## 📖 Accessing Documentation

### Swagger UI
- **URL**: `http://localhost:4000/v1/api-docs`
- **Description**: Interactive API documentation with testing capabilities

### JSON Specification
- **URL**: `http://localhost:4000/v1/api-docs.json`
- **Description**: Raw OpenAPI 3.0 specification in JSON format

## 🚀 Features

### Interactive Testing
- **Try It Out**: Test endpoints directly from the documentation
- **Authentication**: Built-in JWT token management
- **Request/Response Examples**: See real examples for all endpoints
- **Schema Validation**: Automatic request/response validation

### Comprehensive Coverage
- **All Endpoints**: Complete API coverage with detailed descriptions
- **Request Schemas**: Detailed input validation requirements
- **Response Schemas**: Expected response formats for all status codes
- **Error Handling**: Comprehensive error response documentation

## 🔐 Authentication in Swagger

### Setting Up JWT Token

1. **Get Token**: Use the `/api/auth/login` or `/api/auth/register` endpoint
2. **Authorize**: Click the "Authorize" button (🔒) at the top of Swagger UI
3. **Enter Token**: Paste your JWT token in the format: `Bearer your-jwt-token`
4. **Test Protected Endpoints**: All authenticated endpoints will now work

### Token Persistence
- Swagger UI remembers your token during the session
- Token is automatically included in all protected endpoint requests
- Use "Logout" button to clear stored token

## 📚 API Structure

### Tags Organization
- **Authentication**: User registration, login, logout, password management
- **User Profile**: Profile viewing and updating
- **User Management**: Admin operations (requires elevated permissions)
- **System**: Health checks and API information

### Security Schemes
- **Bearer Authentication**: JWT tokens for API access
- **Role-based Access**: Different permission levels (USER, MODERATOR, ADMIN)

## 🧪 Testing Workflows

### Basic User Flow
1. **Register**: `POST /api/auth/register` - Create new account
2. **Login**: `POST /api/auth/login` - Get JWT token
3. **Authorize**: Set token in Swagger UI
4. **Profile**: `GET /api/users/profile` - View profile
5. **Update**: `PUT /api/users/profile` - Update profile

### Admin Flow
1. **Login as Admin**: Use admin credentials
2. **Authorize**: Set admin token
3. **List Users**: `GET /api/users` - View all users
4. **Manage Users**: Toggle status, delete users
5. **View Details**: Get specific user information

### Session Management
1. **View Sessions**: `GET /api/auth/sessions` - See active sessions
2. **Revoke Session**: `DELETE /api/auth/sessions/{id}` - Remove specific session
3. **Logout**: `POST /api/auth/logout` - End current session

## 📋 Request/Response Examples

### Successful Registration
```json
{
  "success": true,
  "message": "สมัครสมาชิกสำเร็จ",
  "data": {
    "user": {
      "id": "clp1234567890",
      "email": "user@example.com",
      "username": "johndoe",
      "role": "USER",
      "isActive": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "7d"
  }
}
```

### Validation Error
```json
{
  "success": false,
  "message": "ข้อมูลไม่ถูกต้อง",
  "errors": [
    {
      "field": "email",
      "message": "กรุณาใส่อีเมลที่ถูกต้อง"
    },
    {
      "field": "password",
      "message": "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"
    }
  ]
}
```

## 🔍 Schema Details

### User Schema
- **Required Fields**: email, username, password
- **Optional Fields**: firstName, lastName
- **Auto-generated**: id, createdAt, updatedAt, role, isActive
- **Relations**: profile (one-to-one), sessions (one-to-many)

### Profile Schema
- **All Optional**: bio, phone, dateOfBirth, address, city, country
- **Validation**: Phone number format, date validation
- **Limits**: Bio max 500 characters, names max 50 characters

### Authentication
- **JWT Format**: Bearer token with 7-day expiration
- **Password Requirements**: 8+ chars, uppercase, lowercase, number, special char
- **Rate Limiting**: Built-in protection against abuse

## 🛠️ Development Tips

### Using Swagger for Development
1. **API First**: Design endpoints in Swagger before implementation
2. **Testing**: Use Swagger UI for manual testing during development
3. **Documentation**: Keep Swagger annotations updated with code changes
4. **Validation**: Use schema validation to catch issues early

### Customization
- **Themes**: Swagger UI supports custom CSS themes
- **Branding**: Customize title, description, and contact information
- **Extensions**: Add custom validators and formatters

### Integration
- **Postman**: Export OpenAPI spec to Postman collection
- **Code Generation**: Generate client SDKs from OpenAPI spec
- **Testing Tools**: Use spec for automated API testing

## 🚨 Common Issues

### Authentication Problems
- **401 Unauthorized**: Check if token is set correctly
- **403 Forbidden**: Verify user has required role permissions
- **Token Expired**: Login again to get fresh token

### Validation Errors
- **400 Bad Request**: Check request body against schema
- **Required Fields**: Ensure all required fields are provided
- **Format Validation**: Verify email, phone, date formats

### Rate Limiting
- **429 Too Many Requests**: Wait for rate limit window to reset
- **Different Limits**: Auth endpoints have stricter limits
- **IP-based**: Rate limits are per IP address

## 📊 Monitoring

### API Usage
- **Response Times**: Monitor endpoint performance
- **Error Rates**: Track 4xx and 5xx responses
- **Authentication**: Monitor login success/failure rates

### Documentation Usage
- **Swagger Analytics**: Track documentation page views
- **Endpoint Popularity**: See which endpoints are used most
- **User Feedback**: Collect feedback on documentation quality

## 🔄 Updates

### Keeping Documentation Current
1. **Code Changes**: Update Swagger annotations with code changes
2. **New Endpoints**: Add complete documentation for new features
3. **Schema Changes**: Update request/response schemas
4. **Examples**: Keep examples current and realistic

### Version Management
- **API Versioning**: Use version numbers in documentation
- **Changelog**: Document breaking changes
- **Migration Guides**: Help users upgrade between versions

## 📞 Support

### Getting Help
- **Documentation Issues**: Report problems with API docs
- **API Questions**: Ask about endpoint usage and parameters
- **Integration Support**: Get help integrating with the API

### Resources
- **OpenAPI Specification**: https://swagger.io/specification/
- **Swagger UI**: https://swagger.io/tools/swagger-ui/
- **Best Practices**: https://swagger.io/resources/articles/best-practices/