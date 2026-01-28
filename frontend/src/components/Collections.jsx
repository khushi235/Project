import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Collections = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        axios.get(`${API}/products`),
        axios.get(`${API}/categories`)
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const currentCategory = categories.find(cat => cat.id === selectedCategory);
  const hasSubcategories = currentCategory && currentCategory.subcategories.length > 0;

  const filteredProducts = products.filter(product => {
    if (selectedCategory === 'all') return true;
    if (product.category !== selectedCategory) return false;
    if (selectedSubcategories.length === 0) return true;
    return selectedSubcategories.includes(product.subcategory);
  });

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

        {/* Subcategory Filter with Checkboxes */}
        {hasSubcategories && (
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

        {/* Product Grid */}
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
      </div>
    </section>
  );
};

export default Collections;