import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import PriceQuoteModal from './PriceQuoteModal';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Categories that use subcategory pricing layout
const PRICING_CATEGORIES = ['necklace', 'bracelet', 'bangle'];

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
      setSubcategoryPricing(pricingRes.data);
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
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => {
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
                      <p className="product-card-price">{product.price}</p>
                    </div>
                  </div>
                );
              })
            ) : (
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
