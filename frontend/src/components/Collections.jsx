import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import PriceQuoteModal from './PriceQuoteModal';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Helper to normalize image URLs to use current domain
const normalizeImageUrl = (url) => {
  if (!url) return '';
  // If it's a relative URL, prepend the backend URL
  if (url.startsWith('/api/uploads/')) {
    return `${BACKEND_URL}${url}`;
  }
  // If it contains /api/uploads/, extract and reconstruct with current domain
  if (url.includes('/api/uploads/')) {
    const filename = url.split('/api/uploads/').pop();
    return `${BACKEND_URL}/api/uploads/${filename}`;
  }
  // Return as-is for external URLs
  return url;
};

// Helper to ensure price has $ sign
const formatPrice = (price) => {
  if (!price) return '';
  const priceStr = String(price).trim();
  // If it already contains $ or is text like "Contact for pricing", return as is
  if (priceStr.includes('$') || priceStr.toLowerCase().includes('contact')) return priceStr;
  // If it starts with a number, add $
  if (/^\d/.test(priceStr)) return `$${priceStr}`;
  return priceStr;
};

// Helper to merge bangle pricing data (All the Way + Half Way into single table)
const mergeBanglePricing = (pricingData) => {
  const banglePricing = pricingData.filter(p => p.category_id === 'bangle');
  const otherPricing = pricingData.filter(p => p.category_id !== 'bangle');
  
  if (banglePricing.length === 0) return pricingData;
  
  // Find All the Way and Half Way data
  const allTheWay = banglePricing.find(p => 
    p.subcategory_name?.toLowerCase().includes('all') || 
    p.subcategory_id?.toLowerCase().includes('all')
  );
  const halfWay = banglePricing.find(p => 
    p.subcategory_name?.toLowerCase().includes('half') || 
    p.subcategory_id?.toLowerCase().includes('half')
  );
  
  // Merge price tables by CTTW
  const cttwMap = new Map();
  
  // Add All the Way prices
  if (allTheWay?.price_table) {
    allTheWay.price_table.forEach(row => {
      const cttw = row.cttw;
      cttwMap.set(cttw, {
        cttw,
        price_all_way: row.price_fg_si || row.price || '',
        price_half_way: ''
      });
    });
  }
  
  // Add Half Way prices
  if (halfWay?.price_table) {
    halfWay.price_table.forEach(row => {
      const cttw = row.cttw;
      if (cttwMap.has(cttw)) {
        cttwMap.get(cttw).price_half_way = row.price_fg_si || row.price || '';
      } else {
        cttwMap.set(cttw, {
          cttw,
          price_all_way: '',
          price_half_way: row.price_fg_si || row.price || ''
        });
      }
    });
  }
  
  // Create merged bangle entry
  const mergedBangle = {
    id: 'bangle-merged',
    category_id: 'bangle',
    subcategory_id: 'bangle',
    subcategory_name: 'Bangles',
    image_url: allTheWay?.image_url || halfWay?.image_url || '',
    price_table: Array.from(cttwMap.values())
  };
  
  return [...otherPricing, mergedBangle];
};

const Collections = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategoryPricing, setSubcategoryPricing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPricing, setSelectedPricing] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes, pricingRes] = await Promise.all([
        axios.get(`${API}/products`),
        axios.get(`${API}/categories`),
        axios.get(`${API}/subcategory-pricing`)
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
      // Merge bangle pricing data
      const mergedPricing = mergeBanglePricing(pricingRes.data);
      setSubcategoryPricing(mergedPricing);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const currentCategory = categories.find(cat => cat.id === selectedCategory);
  const hasSubcategories = currentCategory && currentCategory.subcategories && currentCategory.subcategories.length > 0;

  // SIMPLIFIED FILTERING LOGIC:
  // 1. "All Collection" (selectedCategory === 'all') -> Show ALL products
  // 2. Category selected (no subcategory) -> Show ALL products in that category
  // 3. Subcategory selected -> Show ONLY products with that subcategory
  const filteredProducts = products.filter(product => {
    // "All Collection" - show ALL products regardless of category or subcategory
    if (selectedCategory === 'all') {
      return true;
    }
    
    // Category selected - filter by product.category
    if (product.category !== selectedCategory) {
      return false;
    }
    
    // If a subcategory is selected, filter by product.subcategory
    if (selectedSubcategory) {
      return product.subcategory === selectedSubcategory;
    }
    
    // No subcategory filter - show all products in the category
    return true;
  });

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(null); // Reset subcategory when category changes
  };

  const handleSubcategoryClick = (subcategoryId) => {
    // Toggle: if same subcategory clicked, deselect it
    if (selectedSubcategory === subcategoryId) {
      setSelectedSubcategory(null);
    } else {
      setSelectedSubcategory(subcategoryId);
    }
  };

  const handleShowPriceQuote = (pricing) => {
    setSelectedPricing(pricing);
  };

  if (loading) {
    return (
      <section id="collections" className="section-padding">
        <div className="container">
          <div className="admin-loading">Loading collections...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="collections" className="section-padding-small">
      <div className="container">
        {/* Main Category Filter */}
        <div className="category-filter">
          {categories.map(category => (
            <button 
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => handleCategoryChange(category.id)}
              data-testid={`category-btn-${category.id}`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Subcategory Filter - Show for categories with subcategories */}
        {hasSubcategories && (
          <div className="subcategory-filter">
            {currentCategory.subcategories.map(subcategory => {
              const isSelected = selectedSubcategory === subcategory.id;
              return (
                <button 
                  key={subcategory.id}
                  className={`subcategory-btn ${isSelected ? 'active' : ''}`}
                  onClick={() => handleSubcategoryClick(subcategory.id)}
                  data-testid={`subcategory-btn-${subcategory.id}`}
                >
                  {subcategory.name}
                </button>
              );
            })}
          </div>
        )}

        {/* Product Grid - Show all filtered products */}
        <div className="grid-product-showcase">
          {filteredProducts.map(product => {
            // Format details: convert "X.X ct total weight" to "X.X cttw"
            const formattedDetails = product.details 
              ? product.details.replace('ct total weight', 'cttw')
              : '';
            
            return (
              <div key={product.id} className="product-card hover-lift" data-testid={`product-card-${product.id}`}>
                <div className="product-card-image-wrapper">
                  <img 
                    className="product-card-image" 
                    src={normalizeImageUrl(product.imageUrl || product.image) || 'https://via.placeholder.com/300x300?text=Diamond'} 
                    alt={product.name}
                    loading="lazy"
                  />
                </div>
                <div className="product-card-content">
                  <h3 className="product-card-title">{product.name}</h3>
                  <p className="product-card-details body-small">{formattedDetails}</p>
                  <p className="product-card-price">{formatPrice(product.price)}</p>
                </div>
              </div>
            );
          })}
          
          {/* No items message */}
          {filteredProducts.length === 0 && (
            <div className="no-products">
              <p className="body-large">No products found in this selection.</p>
            </div>
          )}
        </div>
      </div>

      {/* Price Quote Modal */}
      {selectedPricing && (
        <PriceQuoteModal 
          pricing={selectedPricing} 
          onClose={() => setSelectedPricing(null)} 
        />
      )}
    </section>
  );
};

export default Collections;
