# API Contracts & Integration Plan

## Overview
Full-stack product management system for Allure Diam Inc diamond jewelry website with admin capabilities integrated directly on pages.

## Backend APIs

### Products API (`/api/products`)
- **GET** `/api/products` - Get all products
- **GET** `/api/products/{id}` - Get product by ID
- **GET** `/api/products/category/{category}` - Get products by category
- **GET** `/api/products/category/{category}/subcategory/{subcategory}` - Filter by subcategory
- **POST** `/api/products` - Create new product
- **PUT** `/api/products/{id}` - Update product
- **DELETE** `/api/products/{id}` - Delete product
- **POST** `/api/products/upload-image` - Upload product image (FormData with file)

### Categories API (`/api/categories`)
- **GET** `/api/categories` - Get all categories
- **GET** `/api/categories/{id}` - Get category by ID
- **POST** `/api/categories` - Create new category
- **PUT** `/api/categories/{id}` - Update category (including subcategories)
- **DELETE** `/api/categories/{id}` - Delete category

### Contact API (`/api/contact`)
- **POST** `/api/contact` - Submit contact form
- **GET** `/api/contact` - Get all contact submissions (admin)
- **GET** `/api/contact/{id}` - Get contact by ID
- **DELETE** `/api/contact/{id}` - Delete contact submission

### Uploads
- **Static Files** `/api/uploads/{filename}` - Serve uploaded images

## Data Models

### Product
```json
{
  "id": "uuid",
  "name": "string",
  "category": "string",
  "subcategory": "string",
  "description": "string",
  "price": "string",
  "image": "string (URL)",
  "details": "string",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### Category
```json
{
  "id": "uuid",
  "name": "string",
  "subcategories": [
    {"id": "string", "name": "string"}
  ],
  "created_at": "datetime"
}
```

### Contact
```json
{
  "id": "uuid",
  "name": "string",
  "email": "string",
  "phone": "string (optional)",
  "message": "string",
  "created_at": "datetime"
}
```

## Frontend Integration Plan

### Phase 1: Update Collections Component
- Remove mock.js dependency
- Fetch products from `/api/products`
- Fetch categories from `/api/categories`
- Implement filtering by category/subcategory

### Phase 2: Admin UI Components
Create admin interface with:
1. **Product Management**
   - Add Product form (with image upload)
   - Edit Product inline on cards
   - Delete Product button on cards
   
2. **Category Management**
   - Add Category/Subcategory form
   - Edit existing categories
   - Delete categories

3. **Contact Form Integration**
   - Save submissions to database
   - Admin view for contact inquiries

### Phase 3: Admin Toggle
- Add admin mode toggle (button in navigation)
- Show/hide admin controls based on mode
- Simple client-side toggle (no auth for now as requested)

## Current Mock Data to Migrate
Location: `/app/frontend/src/mock.js`
- 23 products across 6 categories
- 6 main categories with subcategories
- Will seed database with this data

## Implementation Steps
1. ✅ Backend models and routes created
2. ✅ Server.py updated with new routes
3. ✅ Backend restarted and running
4. 🔄 Next: Seed database with mock data
5. 🔄 Next: Update frontend to use APIs
6. 🔄 Next: Build admin UI components
7. 🔄 Next: Integrate contact form with backend
8. 🔄 Next: Testing
