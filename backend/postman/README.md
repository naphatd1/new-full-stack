# Postman Collection - User Management API

This directory contains Postman collection and environment files for testing the User Management API.

## Files

- `User-Management-API.postman_collection.json` - Complete API collection
- `User-Management-API.postman_environment.json` - Environment variables
- `README.md` - This documentation

## Quick Start

### 1. Import to Postman

1. Open Postman
2. Click "Import" button
3. Select both JSON files:
   - `User-Management-API.postman_collection.json`
   - `User-Management-API.postman_environment.json`

### 2. Set Environment

1. Select "User Management API Environment" from the environment dropdown
2. Make sure your API server is running on `http://localhost:4000`

### 3. Test Flow

#### Basic Authentication Flow:
1. **Register** - Create a new user account
2. **Login** - Get JWT token (automatically saved to environment)
3. **Get My Profile** - Test authenticated endpoint
4. **Update My Profile** - Test profile update

#### Admin Flow (requires admin account):
1. **Login** with admin credentials
2. **Get All Users** - View all users
3. **Toggle User Status** - Enable/disable users
4. **Delete User** - Remove users

## Environment Variables

The collection uses these environment variables:

| Variable | Description | Auto-set |
|----------|-------------|----------|
| `base_url` | API base URL (http://localhost:4000/v1) | Manual |
| `auth_token` | JWT token | ✅ Auto |
| `user_id` | Current user ID | ✅ Auto |
| `user_role` | Current user role | ✅ Auto |
| `target_user_id` | Target user for admin operations | Manual |
| `session_id` | Session ID for revocation | Manual |
| `session_token` | Session token | Manual |

## API Endpoints

### 🔐 Authentication
- `POST /v1/api/auth/register` - Register new user
- `POST /v1/api/auth/login` - Login user
- `POST /v1/api/auth/logout` - Logout user
- `POST /v1/api/auth/refresh-token` - Refresh JWT token
- `POST /v1/api/auth/change-password` - Change password
- `GET /v1/api/auth/sessions` - Get user sessions
- `DELETE /v1/api/auth/sessions/:id` - Revoke session

### 👤 User Profile
- `GET /v1/api/users/profile` - Get current user profile
- `PUT /v1/api/users/profile` - Update current user profile

### 👥 User Management (Admin/Moderator)
- `GET /v1/api/users` - Get all users (with pagination)
- `GET /v1/api/users/:id` - Get user by ID
- `PATCH /v1/api/users/:id/toggle-status` - Toggle user status (Admin only)
- `DELETE /v1/api/users/:id` - Delete user (Admin only)

### 🔧 System
- `GET /health` - Health check
- `GET /v1/api` - API information
- `GET /` - Root endpoint

## Test Accounts

After running `npm run db:seed`, you can use these test accounts:

### Admin Account
```json
{
  "email": "admin@example.com",
  "password": "Admin123!@#"
}
```

### Moderator Account
```json
{
  "email": "moderator@example.com",
  "password": "Moderator123!@#"
}
```

### Regular Users
```json
{
  "email": "user1@example.com",
  "password": "User1123!@#"
}
```

## Authentication

The collection automatically handles JWT token management:

1. **Login/Register** requests automatically save the JWT token
2. **Protected endpoints** use the saved token automatically
3. **Token refresh** updates the saved token

### Manual Token Setup

If you need to set a token manually:

1. Go to Environment settings
2. Set `auth_token` variable with your JWT token
3. The token will be used in `Authorization: Bearer {{auth_token}}` header

## Error Handling

The API returns consistent error responses:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": []
}
```

## Rate Limiting

The API has rate limiting enabled:

- **General API**: 100 requests per 15 minutes
- **Auth endpoints**: 5 requests per 15 minutes
- **Registration**: 3 requests per hour

## Security Features

- **Argon2 password hashing** - Enhanced security
- **JWT authentication** - Stateless authentication
- **Role-based access control** - USER, MODERATOR, ADMIN
- **Session management** - Track and revoke sessions
- **Input validation** - Comprehensive validation
- **Rate limiting** - Prevent abuse

## Tips

1. **Auto-save tokens**: Login/Register requests automatically save JWT tokens
2. **Environment switching**: Use different environments for dev/staging/prod
3. **Bulk testing**: Use Postman Runner for automated testing
4. **Variables**: Use `{{variable}}` syntax for dynamic values
5. **Pre-request scripts**: Collection includes token management scripts

## Troubleshooting

### Common Issues

1. **401 Unauthorized**
   - Check if `auth_token` is set in environment
   - Verify token hasn't expired (7 days default)
   - Try refreshing token or login again

2. **403 Forbidden**
   - Check user role permissions
   - Admin endpoints require ADMIN role
   - Some endpoints require MODERATOR or higher

3. **404 Not Found**
   - Verify API server is running
   - Check `base_url` in environment
   - Ensure correct endpoint paths

4. **Rate Limited**
   - Wait for rate limit window to reset
   - Use different IP or wait period specified in error

### Debug Steps

1. Check environment variables are set correctly
2. Verify API server is running on correct port
3. Check network connectivity
4. Review request/response in Postman console
5. Check API server logs for detailed errors

## Collection Structure

```
User Management API/
├── Authentication/
│   ├── Register
│   ├── Login
│   ├── Refresh Token
│   ├── Change Password
│   ├── Get Sessions
│   ├── Revoke Session
│   └── Logout
├── User Profile/
│   ├── Get My Profile
│   └── Update My Profile
├── User Management (Admin)/
│   ├── Get All Users
│   ├── Get User by ID
│   ├── Toggle User Status
│   └── Delete User
└── System/
    ├── Health Check
    ├── API Info
    └── Root
```

## Contributing

When adding new endpoints:

1. Add request to appropriate folder
2. Include proper authentication headers
3. Add description and examples
4. Update environment variables if needed
5. Test thoroughly before committing