# Allure Diam Inc - Diamond Jewelry E-Commerce Website

## Product Overview
A luxury minimalist e-commerce website for Allure Diam Inc, showcasing diamond jewelry including tennis necklaces, tennis bracelets, eternity bands, and rings.

## Tech Stack
- **Frontend**: React, Tailwind CSS, Sonner (toasts)
- **Backend**: FastAPI, Pydantic
- **Database**: MongoDB (Motor async driver)
- **Fonts**: Roboto (body), Great Vibes (hero cursive)

## Core Features

### Public Site
- Hero section with cursive title
- Product categories: Necklaces, Bracelets, Rings, Bangles, Pendants
- Subcategory filtering with multi-select checkboxes
- Product cards (5 per row desktop, 2 mobile) showing price and carat weight
- Premium Loose Diamonds promotional section
- Contact information display
- Footer with company details

### Admin Panel (Protected)
- **Credentials**: admin / allure2025
- Full CRUD for products and categories
- Image URL management
- Product sorting functionality
- Edit/Delete badges on all items

## Implemented Features (Jan 2025)

### ✅ Completed
- [x] Full-stack app setup (React + FastAPI + MongoDB)
- [x] Product display with category filtering
- [x] Password-protected Admin Panel with CRUD
- [x] Roboto font sitewide
- [x] Light blue background theme
- [x] Compact rounded product cards
- [x] 5-column grid layout (responsive to 2 columns on mobile)
- [x] Premium Loose Diamonds section with image
- [x] Contact info display (form removed)
- [x] Admin button with gradient and curved edges
- [x] Enlarged "ALLURE DIAM INC" logo
- [x] **Cursive hero title** (Great Vibes font) - Jan 28, 2025
- [x] **Checkbox subcategory filters** (multi-select) - Jan 28, 2025

### 🔄 Verification Pending
- [ ] Admin changes auto-refreshing on client side (implemented via refreshKey)
- [ ] Loose diamond image filling container correctly (object-cover applied)

## API Endpoints
- `GET/POST /api/products` - List/Create products
- `PUT/DELETE /api/products/{id}` - Update/Delete product
- `GET/POST /api/categories` - List/Create categories
- `PUT/DELETE /api/categories/{id}` - Update/Delete category

## Database Schema
```
products: {_id, name, price, details, category, subcategory, imageUrl}
categories: {_id, name, subcategories: [{id, name}]}
```

## Key Files
- `/app/frontend/src/App.css` - Core styles and CSS variables
- `/app/frontend/src/components/Collections.jsx` - Product display & filtering
- `/app/frontend/src/components/AdminPanel.jsx` - Admin CRUD interface
- `/app/backend/routes/products.py` - Product API
- `/app/backend/routes/categories.py` - Category API

## Backlog (Future Tasks)
- CSS cleanup: consolidate index.css and App.css
- Consider adding product detail modal/page
- Add image upload functionality (currently URL-based)
