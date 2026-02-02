import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import PriceQuoteModal from './PriceQuoteModal';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Categories that use subcategory pricing layout (by ID or name pattern)
const PRICING_CATEGORIES = ['necklace', 'bracelet', 'bangle', 'pendant'];

// Helper to check if a category uses pricing layout
const isPricingCategoryById = (categoryId, categories) => {
  if (PRICING_CATEGORIES.includes(categoryId)) return true;
  // Check if it's the Earrings category (has UUID)
  const category = categories.find(c => c.id === categoryId);
  if (category && category.name.toLowerCase() === 'earrings') return true;
  return false;
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
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
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
  const hasSubcategories = currentCategory && currentCategory.subcategories.length > 0;
  const isPricingCategory = PRICING_CATEGORIES.includes(selectedCategory);

  // Get pricing data for current category
  const categoryPricingData = subcategoryPricing.filter(p => p.category_id === selectedCategory);

  // Filter products for non-pricing categories
  const filteredProducts = products.filter(product => {
    if (selectedCategory === 'all') {
      // For "All Collections", only show products from non-pricing categories
      return !PRICING_CATEGORIES.includes(product.category);
    }
    if (isPricingCategory) return false; // Don't show individual products for pricing categories
    if (product.category !== selectedCategory) return false;
    if (selectedSubcategories.length === 0) return true;
    return selectedSubcategories.includes(product.subcategory);
  });

  // Get all pricing data for "All Collections" view
  const allPricingData = selectedCategory === 'all' ? subcategoryPricing : [];

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategories([]);
  };

  const handleSubcategoryToggle = (subcategoryId) => {
    setSelectedSubcategories(prev => {
      if (prev.includes(subcategoryId)) {
        return prev.filter(id => id !== subcategoryId);
      } else {
        return [...prev, subcategoryId];
      }
    });
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

        {/* Subcategory Filter with Checkboxes - Only for non-pricing categories */}
        {hasSubcategories && !isPricingCategory && (
          <div className="subcategory-filter">
            {currentCategory.subcategories.map(subcategory => {
              const isChecked = selectedSubcategories.includes(subcategory.id);
              return (
                <label 
                  key={subcategory.id}
                  className={`subcategory-checkbox-label ${isChecked ? 'checked' : ''}`}
                  data-testid={`subcategory-checkbox-${subcategory.id}`}
                >
                  <input
                    type="checkbox"
                    className="subcategory-checkbox"
                    checked={isChecked}
                    onChange={() => handleSubcategoryToggle(subcategory.id)}
                  />
                  {subcategory.name}
                </label>
              );
            })}
          </div>
        )}

        {/* Subcategory Pricing Cards - For Necklaces, Bracelets, Bangles */}
        {isPricingCategory && (
          <div className="grid-product-showcase">
            {categoryPricingData.length > 0 ? (
              categoryPricingData.map(pricing => (
                <div key={pricing.id} className="product-card hover-lift" data-testid={`pricing-card-${pricing.id}`}>
                  <div className="product-card-image-wrapper">
                    <img 
                      className="product-card-image" 
                      src={pricing.image_url} 
                      alt={pricing.subcategory_name}
                      loading="lazy"
                    />
                  </div>
                  <div className="product-card-content">
                    <h3 className="product-card-title">{pricing.subcategory_name}</h3>
                    <button 
                      className="btn-price-quote"
                      onClick={() => handleShowPriceQuote(pricing)}
                    >
                      Show Price Quote
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-products">
                <p className="body-large">No items available in this category yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Regular Product Grid - For Rings, Pendants, and All Collections */}
        {!isPricingCategory && (
          <div className="grid-product-showcase">
            {/* Show pricing cards in All Collections */}
            {selectedCategory === 'all' && allPricingData.map(pricing => (
              <div key={pricing.id} className="product-card hover-lift" data-testid={`pricing-card-${pricing.id}`}>
                <div className="product-card-image-wrapper">
                  <img 
                    className="product-card-image" 
                    src={pricing.image_url} 
                    alt={pricing.subcategory_name}
                    loading="lazy"
                  />
                </div>
                <div className="product-card-content">
                  <h3 className="product-card-title">{pricing.subcategory_name}</h3>
                  <button 
                    className="btn-price-quote"
                    onClick={() => handleShowPriceQuote(pricing)}
                  >
                    Show Price Quote
                  </button>
                </div>
              </div>
            ))}
            
            {/* Show regular products */}
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
                      src={product.image} 
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
            {filteredProducts.length === 0 && allPricingData.length === 0 && (
              <div className="no-products">
                <p className="body-large">No products found in this category.</p>
              </div>
            )}
          </div>
        )}
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
