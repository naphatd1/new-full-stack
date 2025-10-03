# Image Upload System Guide

This guide explains how to use the image upload system in the User Management API.

## 📸 Overview

The API supports two methods for image uploads:
1. **File Upload**: Traditional multipart/form-data file upload
2. **Base64 Upload**: JSON-based base64 encoded image upload

Both methods automatically process images using Sharp for optimization.

## 🚀 Features

### Image Processing
- **Automatic Resizing**: Images are resized to max 800x800px while maintaining aspect ratio
- **Format Conversion**: All images are converted to JPEG format for consistency
- **Quality Optimization**: JPEG quality set to 85% for optimal size/quality balance
- **Progressive JPEG**: Enables progressive loading for better user experience

### Validation
- **File Type**: Only image files (jpg, jpeg, png, gif, webp) are accepted
- **File Size**: Maximum 5MB for avatars, 10MB for general images
- **Base64 Validation**: Automatic validation of base64 format and size

### Security
- **Authentication Required**: All upload endpoints require JWT authentication
- **Memory Processing**: Files are processed in memory (not saved to disk)
- **Input Sanitization**: All inputs are validated and sanitized

## 📋 API Endpoints

### Upload Avatar
- **Endpoint**: `POST /v1/api/upload/avatar`
- **Purpose**: Upload user profile avatar
- **Authentication**: Required
- **File Size Limit**: 5MB
- **Updates**: User's avatar field in database

### Remove Avatar
- **Endpoint**: `DELETE /v1/api/upload/avatar`
- **Purpose**: Remove user profile avatar
- **Authentication**: Required
- **Action**: Sets user's avatar to null

### Upload General Image
- **Endpoint**: `POST /v1/api/upload/image`
- **Purpose**: Upload and process any image
- **Authentication**: Required
- **File Size Limit**: 10MB
- **Returns**: Processed base64 image

## 🔧 Usage Examples

### 1. File Upload (Multipart Form Data)

#### JavaScript/Fetch
```javascript
const formData = new FormData();
formData.append('avatar', fileInput.files[0]);

const response = await fetch('/v1/api/upload/avatar', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});

const result = await response.json();
```

#### cURL
```bash
curl -X POST \
  -H "Authorization: Bearer your-jwt-token" \
  -F "avatar=@/path/to/image.jpg" \
  http://localhost:4000/v1/api/upload/avatar
```

### 2. Base64 Upload (JSON)

#### JavaScript/Fetch
```javascript
// Convert file to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

const base64Image = await fileToBase64(fileInput.files[0]);

const response = await fetch('/v1/api/upload/avatar', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    avatar: base64Image
  })
});
```

#### cURL
```bash
curl -X POST \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{"avatar":"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD..."}' \
  http://localhost:4000/v1/api/upload/avatar
```

### 3. Remove Avatar

```javascript
const response = await fetch('/v1/api/upload/avatar', {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## 📊 Response Format

### Successful Upload Response
```json
{
  "success": true,
  "message": "อัปโหลดรูปโปรไฟล์สำเร็จ",
  "data": {
    "user": {
      "id": "clp1234567890",
      "email": "user@example.com",
      "avatar": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD...",
      // ... other user fields
    },
    "imageInfo": {
      "size": 245760,
      "originalName": "avatar.jpg",
      "processedFormat": "JPEG"
    }
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "รูปภาพมีขนาดใหญ่เกินไป (สูงสุด 5MB)",
  "errors": [
    {
      "field": "avatar",
      "message": "รูปภาพต้องเป็นรูปแบบ base64 ที่ถูกต้อง"
    }
  ]
}
```

## 🎨 Frontend Integration

### React Example
```jsx
import React, { useState } from 'react';

const AvatarUpload = ({ token, onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    // Upload file
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch('/v1/api/upload/avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();
      
      if (result.success) {
        onUploadSuccess(result.data.user);
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการอัปโหลด');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={uploading}
      />
      {preview && (
        <img 
          src={preview} 
          alt="Preview" 
          style={{ width: 100, height: 100, objectFit: 'cover' }}
        />
      )}
      {uploading && <p>กำลังอัปโหลด...</p>}
    </div>
  );
};
```

### Vue.js Example
```vue
<template>
  <div>
    <input
      type="file"
      accept="image/*"
      @change="handleFileSelect"
      :disabled="uploading"
    />
    <img
      v-if="preview"
      :src="preview"
      alt="Preview"
      class="preview-image"
    />
    <p v-if="uploading">กำลังอัปโหลด...</p>
  </div>
</template>

<script>
export default {
  props: ['token'],
  data() {
    return {
      uploading: false,
      preview: null
    };
  },
  methods: {
    async handleFileSelect(event) {
      const file = event.target.files[0];
      if (!file) return;

      // Show preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.preview = e.target.result;
      };
      reader.readAsDataURL(file);

      // Upload as base64
      this.uploading = true;
      try {
        const base64 = await this.fileToBase64(file);
        
        const response = await fetch('/v1/api/upload/avatar', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ avatar: base64 })
        });

        const result = await response.json();
        
        if (result.success) {
          this.$emit('upload-success', result.data.user);
        } else {
          alert(result.message);
        }
      } catch (error) {
        alert('เกิดข้อผิดพลาดในการอัปโหลด');
      } finally {
        this.uploading = false;
      }
    },

    fileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    }
  }
};
</script>

<style>
.preview-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
}
</style>
```

## 🔍 Technical Details

### Image Processing Pipeline
1. **Input Validation**: Check file type and size
2. **Memory Loading**: Load image into memory buffer
3. **Sharp Processing**: 
   - Resize to max 800x800px (maintaining aspect ratio)
   - Convert to JPEG format
   - Apply 85% quality compression
   - Enable progressive loading
4. **Base64 Encoding**: Convert processed image to base64
5. **Database Storage**: Store base64 string in user record

### Performance Considerations
- **Memory Usage**: Images are processed in memory, not saved to disk
- **Processing Time**: Typical processing time is 100-500ms per image
- **Bandwidth**: Base64 encoding increases size by ~33%
- **Caching**: Consider implementing client-side caching for uploaded images

### Security Measures
- **File Type Validation**: Only image MIME types are accepted
- **Size Limits**: Enforced at multiple levels (multer, validation, base64)
- **Memory Limits**: Multer configured with memory limits
- **Input Sanitization**: All inputs are validated and sanitized
- **Authentication**: All endpoints require valid JWT tokens

## 🚨 Error Handling

### Common Errors
- **413 Payload Too Large**: File exceeds size limit
- **400 Bad Request**: Invalid file type or malformed base64
- **401 Unauthorized**: Missing or invalid JWT token
- **500 Internal Server Error**: Image processing failure

### Error Prevention
- **Client-side Validation**: Validate file type and size before upload
- **Progress Indicators**: Show upload progress to users
- **Error Messages**: Display clear, user-friendly error messages
- **Retry Logic**: Implement retry for network failures

## 📱 Mobile Considerations

### React Native Example
```javascript
import { launchImageLibrary } from 'react-native-image-picker';

const uploadAvatar = () => {
  launchImageLibrary(
    {
      mediaType: 'photo',
      quality: 0.8,
      includeBase64: true,
    },
    (response) => {
      if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        const base64Image = `data:${asset.type};base64,${asset.base64}`;
        
        // Upload base64 image
        fetch('/v1/api/upload/avatar', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ avatar: base64Image })
        });
      }
    }
  );
};
```

## 🔧 Configuration

### Environment Variables
```env
# Maximum file size for uploads (in bytes)
MAX_AVATAR_SIZE=5242880  # 5MB
MAX_IMAGE_SIZE=10485760  # 10MB

# Image processing settings
IMAGE_QUALITY=85
IMAGE_MAX_WIDTH=800
IMAGE_MAX_HEIGHT=800
```

### Customization Options
- **Image Dimensions**: Modify resize parameters in middleware
- **Quality Settings**: Adjust JPEG quality for size/quality balance
- **File Size Limits**: Configure limits in multer and validators
- **Supported Formats**: Add/remove supported image formats

## 📊 Monitoring

### Metrics to Track
- **Upload Success Rate**: Percentage of successful uploads
- **Processing Time**: Average image processing duration
- **File Sizes**: Distribution of uploaded file sizes
- **Error Rates**: Frequency and types of upload errors

### Logging
- **Upload Events**: Log all upload attempts with user ID and file info
- **Processing Errors**: Log image processing failures with details
- **Performance Metrics**: Track processing times and memory usage