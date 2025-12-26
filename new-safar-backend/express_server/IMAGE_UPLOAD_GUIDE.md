# Image Upload Guide - Category & Location Modules

## Changes Made

Images are now stored as **binary data (Buffer)** in MongoDB instead of file paths.

## API Endpoints

### Category Routes

#### Create Category with Images
```
POST /api/category
Content-Type: multipart/form-data

Fields:
- name: string (required)
- image: file (main image)
- feature_images: file[] (multiple files)
- short_description: string
- long_description: string
- status: 'active' | 'inactive'
- seo_fields: object
```

#### Update Category with Images
```
PUT /api/category/:id
Content-Type: multipart/form-data

(Same fields as create - only send fields you want to update)
```

#### Get Category Image
```
GET /api/category/:id/image
Returns: Image file (jpeg/png/etc)
```

#### Get Category Feature Image
```
GET /api/category/:id/feature-image/:index
Returns: Image file at the specified index
```

### Location Routes

#### Create Location with Images
```
POST /api/location
Content-Type: multipart/form-data

Fields:
- name: string (required)
- image: file (main image)
- feature_images: file[] (multiple files)
- short_description: string
- long_description: string
- state: string
- country: string
- status: 'active' | 'inactive'
- seo_fields: object
```

#### Update Location with Images
```
PUT /api/location/:id
Content-Type: multipart/form-data

(Same fields as create)
```

#### Get Location Image
```
GET /api/location/:id/image
Returns: Image file
```

#### Get Location Feature Image
```
GET /api/location/:id/feature-image/:index
Returns: Image file at the specified index
```

## Frontend Example (React/TypeScript)

### Upload Category with Image

```javascript
const formData = new FormData();
formData.append('name', 'Adventure Tours');
formData.append('short_description', 'Exciting adventure trips');
formData.append('status', 'active');

// Add main image
const imageFile = document.getElementById('imageInput').files[0];
formData.append('image', imageFile);

// Add feature images
const featureFiles = document.getElementById('featureImagesInput').files;
for (let i = 0; i < featureFiles.length; i++) {
  formData.append('feature_images', featureFiles[i]);
}

// Send request
const response = await fetch('http://localhost:8000/api/category', {
  method: 'POST',
  credentials: 'include',
  body: formData
  // Don't set Content-Type header - browser sets it automatically with boundary
});

const data = await response.json();
console.log(data);
```

### Display Category Image

```javascript
// In your component
<img 
  src={`http://localhost:8000/api/category/${categoryId}/image`} 
  alt="Category" 
/>

// Feature images
{category.feature_images?.map((_, index) => (
  <img 
    key={index}
    src={`http://localhost:8000/api/category/${categoryId}/feature-image/${index}`} 
    alt={`Feature ${index}`}
  />
))}
```

### Update Category (with or without new images)

```javascript
const formData = new FormData();

// Update text fields
formData.append('name', 'Updated Name');
formData.append('short_description', 'Updated description');

// Only add image if user selected a new one
const newImage = document.getElementById('imageInput').files[0];
if (newImage) {
  formData.append('image', newImage);
}

const response = await fetch(`http://localhost:8000/api/category/${id}`, {
  method: 'PUT',
  credentials: 'include',
  body: formData
});
```

## Postman Testing

1. **Create/Update with Images:**
   - Method: POST or PUT
   - URL: `http://localhost:8000/api/category`
   - Body: Select "form-data"
   - Add fields:
     - `name` (Text): "Test Category"
     - `image` (File): Select image file
     - `feature_images` (File): Select multiple files
     - `short_description` (Text): "Description here"

2. **Get Image:**
   - Method: GET
   - URL: `http://localhost:8000/api/category/:id/image`
   - The image will display in Postman preview

## Database Schema

```javascript
// Category/Location Model
{
  name: String,
  image: {
    data: Buffer,        // Binary image data
    contentType: String  // 'image/jpeg', 'image/png', etc.
  },
  feature_images: [{
    data: Buffer,
    contentType: String
  }],
  // ... other fields
}
```

## Benefits

1. ✅ No file system management needed
2. ✅ Images stored directly in database
3. ✅ Automatic backup with database backup
4. ✅ No broken links to files
5. ✅ Works in cloud environments easily

## Notes

- Images are stored as Buffer (binary data) in MongoDB
- `multer` handles file uploads in memory
- Maximum 1 main image, 10 feature images per item
- Images are served with correct Content-Type headers
- Supports all common image formats (JPEG, PNG, GIF, WebP, etc.)
