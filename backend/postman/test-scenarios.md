# Test Scenarios for User Management API

This document outlines comprehensive test scenarios for the User Management API using Postman.

## 🧪 Test Scenarios

### 1. User Registration & Authentication

#### Scenario 1.1: Successful User Registration
**Steps:**
1. Send POST to `/api/auth/register` with valid data
2. Verify response status is 201
3. Verify response contains user data and JWT token
4. Verify token is automatically saved to environment

**Expected Result:**
```json
{
  "success": true,
  "message": "สมัครสมาชิกสำเร็จ",
  "data": {
    "user": {
      "id": "user_id",
      "email": "test@example.com",
      "username": "testuser",
      "role": "USER"
    },
    "token": "jwt_token",
    "expiresIn": "7d"
  }
}
```

#### Scenario 1.2: Registration with Duplicate Email
**Steps:**
1. Register a user with email `test@example.com`
2. Try to register another user with same email
3. Verify response status is 409
4. Verify error message about duplicate email

#### Scenario 1.3: Registration with Invalid Password
**Steps:**
1. Send POST to `/api/auth/register` with weak password
2. Verify response status is 400
3. Verify validation error for password requirements

#### Scenario 1.4: Successful Login
**Steps:**
1. Send POST to `/api/auth/login` with valid credentials
2. Verify response status is 200
3. Verify JWT token is returned and saved
4. Verify user data is returned

#### Scenario 1.5: Login with Invalid Credentials
**Steps:**
1. Send POST to `/api/auth/login` with wrong password
2. Verify response status is 401
3. Verify error message about invalid credentials

### 2. JWT Token Management

#### Scenario 2.1: Access Protected Endpoint with Valid Token
**Steps:**
1. Login to get JWT token
2. Send GET to `/api/users/profile` with token
3. Verify response status is 200
4. Verify user profile data is returned

#### Scenario 2.2: Access Protected Endpoint without Token
**Steps:**
1. Send GET to `/api/users/profile` without Authorization header
2. Verify response status is 401
3. Verify error message about missing token

#### Scenario 2.3: Access Protected Endpoint with Invalid Token
**Steps:**
1. Send GET to `/api/users/profile` with invalid token
2. Verify response status is 401
3. Verify error message about invalid token

#### Scenario 2.4: Token Refresh
**Steps:**
1. Login to get JWT token
2. Send POST to `/api/auth/refresh-token`
3. Verify response status is 200
4. Verify new token is returned

### 3. User Profile Management

#### Scenario 3.1: Get User Profile
**Steps:**
1. Login as regular user
2. Send GET to `/api/users/profile`
3. Verify response status is 200
4. Verify profile data is returned
5. Verify password is not included in response

#### Scenario 3.2: Update User Profile
**Steps:**
1. Login as regular user
2. Send PUT to `/api/users/profile` with updated data
3. Verify response status is 200
4. Verify updated data is returned
5. Send GET to verify changes persisted

#### Scenario 3.3: Update Profile with Invalid Data
**Steps:**
1. Login as regular user
2. Send PUT to `/api/users/profile` with invalid phone number
3. Verify response status is 400
4. Verify validation error message

### 4. Password Management

#### Scenario 4.1: Change Password Successfully
**Steps:**
1. Login as regular user
2. Send POST to `/api/auth/change-password` with valid data
3. Verify response status is 200
4. Verify success message
5. Try to login with old password (should fail)
6. Login with new password (should succeed)

#### Scenario 4.2: Change Password with Wrong Current Password
**Steps:**
1. Login as regular user
2. Send POST to `/api/auth/change-password` with wrong current password
3. Verify response status is 400
4. Verify error message about incorrect current password

#### Scenario 4.3: Change Password with Invalid New Password
**Steps:**
1. Login as regular user
2. Send POST to `/api/auth/change-password` with weak new password
3. Verify response status is 400
4. Verify validation error for password requirements

### 5. Session Management

#### Scenario 5.1: Get User Sessions
**Steps:**
1. Login as regular user
2. Send GET to `/api/auth/sessions`
3. Verify response status is 200
4. Verify sessions list is returned
5. Verify session contains user agent and IP info

#### Scenario 5.2: Revoke Specific Session
**Steps:**
1. Login as regular user
2. Get sessions list
3. Send DELETE to `/api/auth/sessions/{sessionId}`
4. Verify response status is 200
5. Verify session is removed from list

#### Scenario 5.3: Logout (Revoke All Sessions)
**Steps:**
1. Login as regular user
2. Send POST to `/api/auth/logout`
3. Verify response status is 200
4. Try to access protected endpoint with old token (should fail)

### 6. Role-Based Access Control

#### Scenario 6.1: User Access to User Endpoints
**Steps:**
1. Login as USER role
2. Send GET to `/api/users/profile` (should succeed)
3. Send GET to `/api/users` (should fail with 403)
4. Verify proper access control

#### Scenario 6.2: Moderator Access to Admin Endpoints
**Steps:**
1. Login as MODERATOR role
2. Send GET to `/api/users` (should succeed)
3. Send GET to `/api/users/{id}` (should succeed)
4. Send PATCH to `/api/users/{id}/toggle-status` (should fail with 403)
5. Send DELETE to `/api/users/{id}` (should fail with 403)

#### Scenario 6.3: Admin Full Access
**Steps:**
1. Login as ADMIN role
2. Test all endpoints (should all succeed)
3. Verify admin can perform all operations

### 7. User Management (Admin Operations)

#### Scenario 7.1: Get All Users with Pagination
**Steps:**
1. Login as ADMIN
2. Send GET to `/api/users?page=1&limit=5`
3. Verify response status is 200
4. Verify pagination data is correct
5. Verify users array contains expected number of items

#### Scenario 7.2: Search Users
**Steps:**
1. Login as ADMIN
2. Send GET to `/api/users?search=john`
3. Verify response status is 200
4. Verify filtered results contain search term

#### Scenario 7.3: Get User by ID
**Steps:**
1. Login as ADMIN
2. Send GET to `/api/users/{valid_user_id}`
3. Verify response status is 200
4. Verify user data is returned
5. Send GET to `/api/users/{invalid_user_id}`
6. Verify response status is 404

#### Scenario 7.4: Toggle User Status
**Steps:**
1. Login as ADMIN
2. Get a user's current status
3. Send PATCH to `/api/users/{id}/toggle-status`
4. Verify response status is 200
5. Verify user status is toggled
6. Verify user can/cannot login based on status

#### Scenario 7.5: Delete User
**Steps:**
1. Login as ADMIN
2. Create a test user
3. Send DELETE to `/api/users/{test_user_id}`
4. Verify response status is 200
5. Verify user is deleted (GET should return 404)

### 8. Rate Limiting

#### Scenario 8.1: General API Rate Limiting
**Steps:**
1. Send 101 requests to `/api` endpoint rapidly
2. Verify first 100 requests succeed
3. Verify 101st request returns 429 (Too Many Requests)
4. Verify rate limit headers are present

#### Scenario 8.2: Auth Endpoint Rate Limiting
**Steps:**
1. Send 6 login requests rapidly
2. Verify first 5 requests are processed
3. Verify 6th request returns 429
4. Wait for rate limit window to reset
5. Verify requests work again

#### Scenario 8.3: Registration Rate Limiting
**Steps:**
1. Send 4 registration requests rapidly
2. Verify first 3 requests are processed
3. Verify 4th request returns 429
4. Verify rate limit message mentions 1 hour wait

### 9. Input Validation

#### Scenario 9.1: Email Validation
**Steps:**
1. Test registration with invalid email formats
2. Verify 400 status and validation errors
3. Test with valid email format
4. Verify success

#### Scenario 9.2: Username Validation
**Steps:**
1. Test registration with short username (< 3 chars)
2. Test with long username (> 30 chars)
3. Test with invalid characters
4. Verify validation errors for each case

#### Scenario 9.3: Password Validation
**Steps:**
1. Test with short password (< 8 chars)
2. Test without uppercase letter
3. Test without lowercase letter
4. Test without number
5. Test without special character
6. Verify validation errors for each case

### 10. Error Handling

#### Scenario 10.1: 404 Not Found
**Steps:**
1. Send request to non-existent endpoint
2. Verify response status is 404
3. Verify error message includes path and method

#### Scenario 10.2: 500 Internal Server Error
**Steps:**
1. Simulate server error (if possible)
2. Verify response status is 500
3. Verify error response format
4. Verify sensitive information is not exposed in production

#### Scenario 10.3: Validation Errors Format
**Steps:**
1. Send request with multiple validation errors
2. Verify response status is 400
3. Verify errors array contains all validation issues
4. Verify error format is consistent

### 11. Security Tests

#### Scenario 11.1: SQL Injection Prevention
**Steps:**
1. Try SQL injection in search parameter
2. Try SQL injection in user input fields
3. Verify no database errors occur
4. Verify Prisma ORM prevents injection

#### Scenario 11.2: XSS Prevention
**Steps:**
1. Submit XSS payload in profile fields
2. Verify data is properly escaped/sanitized
3. Verify no script execution occurs

#### Scenario 11.3: Password Security
**Steps:**
1. Register user with password
2. Verify password is hashed with Argon2
3. Verify password is never returned in responses
4. Verify password comparison works correctly

## 🚀 Running Test Scenarios

### Manual Testing
1. Import Postman collection and environment
2. Follow each scenario step by step
3. Verify expected results
4. Document any issues found

### Automated Testing
1. Use Postman Runner for bulk testing
2. Set up test scripts in collection
3. Run scenarios in sequence
4. Generate test reports

### Continuous Integration
1. Use Newman (Postman CLI) for CI/CD
2. Run tests automatically on code changes
3. Integrate with testing pipeline
4. Monitor test results

## 📊 Test Data

### Test Users
```json
{
  "admin": {
    "email": "admin@example.com",
    "password": "Admin123!@#",
    "role": "ADMIN"
  },
  "moderator": {
    "email": "moderator@example.com", 
    "password": "Moderator123!@#",
    "role": "MODERATOR"
  },
  "user": {
    "email": "user1@example.com",
    "password": "User1123!@#",
    "role": "USER"
  }
}
```

### Test Profile Data
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Software Developer",
  "phone": "+66812345678",
  "dateOfBirth": "1990-01-15",
  "address": "123 Main Street",
  "city": "Bangkok",
  "country": "Thailand"
}
```

## 📝 Test Checklist

- [ ] User registration works correctly
- [ ] User login/logout works correctly
- [ ] JWT token management works
- [ ] Password hashing with Argon2 works
- [ ] Role-based access control works
- [ ] Profile management works
- [ ] Session management works
- [ ] Rate limiting works correctly
- [ ] Input validation works
- [ ] Error handling is consistent
- [ ] Security measures are effective
- [ ] API documentation is accurate