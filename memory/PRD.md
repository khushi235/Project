# Allure Diam Inc - Diamond Jewelry E-Commerce Website

## Product Overview
A luxury minimalist e-commerce website for Allure Diam Inc, showcasing diamond jewelry with a premium animated background featuring "northern lights" aurora effect.

## Tech Stack
- **Frontend**: React, Tailwind CSS, Sonner (toasts)
- **Backend**: FastAPI, Pydantic
- **Database**: MongoDB (Motor async driver)
- **Fonts**: Roboto (body), Playfair Display (logo), Great Vibes (cursive accents)

## Core Features

### Public Site
- **Northern Lights Background**: Animated aurora effect with soft warm palette (rose, mauve, sage green, peach tones)
- **Floating White Stars**: Sparkle overlay for premium feel
- Product categories: Necklaces, Bracelets, Rings, Bangles, Pendants, Earrings
- **Dual Product Display System**:
  - Necklaces, Bracelets, Bangles: Subcategory cards with "Show Price Quote" modal (pricing table)
  - Rings, Pendants, Earrings: Traditional product grid cards
- Subcategory filtering with multi-select checkboxes
- Product cards (5 per row desktop, 2 mobile) showing price and carat weight ("cttw" format)
- Premium Loose Diamonds promotional section
- Contact information display
- Footer with company details and showroom address

### Admin Panel (Protected)
- **Credentials**: admin / allure2025
- Full CRUD for products and categories
- **Price Tables Tab**: Manage subcategory images and pricing tiers for Necklaces/Bracelets/Bangles
- Image URL management
- Product sorting functionality
- Edit/Delete badges on all items

## Implemented Features

### ✅ Completed (Jan 2025)
- [x] Full-stack app setup (React + FastAPI + MongoDB)
- [x] Product display with category filtering
- [x] Password-protected Admin Panel with CRUD
- [x] **Northern lights aurora animation** - soft warm palette with flowing color bands
- [x] **Floating white stars/sparkles** overlay
- [x] **Price Quote System** for Necklaces, Bracelets, Bangles
- [x] Admin "Price Tables" tab for subcategory pricing management
- [x] Full-width header with Playfair Display logo
- [x] Pure white product cards with centered text
- [x] Hover-to-grow text effect on cards
- [x] "cttw" format for carat weight
- [x] Checkbox subcategory filters (multi-select)
- [x] Showroom address moved to footer

## API Endpoints
- `GET/POST /api/products` - List/Create products
- `PUT/DELETE /api/products/{id}` - Update/Delete product
- `GET/POST /api/categories` - List/Create categories
- `PUT/DELETE /api/categories/{id}` - Update/Delete category
- `GET/POST /api/subcategory-pricing` - List/Create subcategory pricing
- `PUT/DELETE /api/subcategory-pricing/{id}` - Update/Delete pricing

## Database Schema
```
products: {_id, name, price, details, category, subcategory, imageUrl}
categories: {_id, name, subcategories: List[str]}
subcategory_pricing: {_id, category, subcategory, imageUrl, pricing_tiers: [{cttw, price}]}
```

## Key Files
- `/app/frontend/src/App.css` - Core styles, animations, CSS variables (northern lights effect)
- `/app/frontend/src/App.js` - Main app with sparkle-layer and floating-particles
- `/app/frontend/src/components/Collections.jsx` - Dual product display & filtering
- `/app/frontend/src/components/PriceQuoteModal.jsx` - Pricing table modal
- `/app/frontend/src/components/AdminPanel.jsx` - Admin CRUD + Price Tables tab
- `/app/backend/routes/products.py` - Product API
- `/app/backend/routes/categories.py` - Category API
- `/app/backend/routes/subcategory_pricing.py` - Price tables API

## Backlog (Future Tasks)
- CSS cleanup: consolidate/refactor bloated animation code in App.css
- Consider adding product detail modal/page
- Add image upload functionality (currently URL-based)
- SEO optimization
- Mobile responsiveness refinements
