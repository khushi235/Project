import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Collections = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
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
    if (selectedSubcategory === 'all') return product.category === selectedCategory;
    return product.category === selectedCategory && product.subcategory === selectedSubcategory;
  });

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory('all');
  };

  const handleSubcategoryChange = (subcategoryId) => {
    setSelectedSubcategory(subcategoryId);
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
    <section id="collections" className="section-padding">
      <div className="container">
        <div className="collections-header">
          <h2 className="hero-medium">Our Collections</h2>
          <p className="body-large collections-subtitle">
            Each piece meticulously crafted to perfection
          </p>
        </div>

        {/* Main Category Filter */}
        <div className="category-filter">
          {categories.map(category => (
            <button 
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => handleCategoryChange(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Subcategory Filter */}
        {hasSubcategories && (
          <div className="subcategory-filter">
            <button 
              className={`subcategory-btn ${selectedSubcategory === 'all' ? 'active' : ''}`}
              onClick={() => handleSubcategoryChange('all')}
            >
              All {currentCategory.name}
            </button>
            {currentCategory.subcategories.map(subcategory => (
              <button 
                key={subcategory.id}
                className={`subcategory-btn ${selectedSubcategory === subcategory.id ? 'active' : ''}`}
                onClick={() => handleSubcategoryChange(subcategory.id)}
              >
                {subcategory.name}
              </button>
            ))}
          </div>
        )}

        {/* Product Grid */}
        <div className="grid-product-showcase">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <div key={product.id} className="product-card hover-lift">
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
                  <p className="product-card-details body-small">{product.details}</p>
                  <p className="product-card-price">{product.price}</p>
                </div>
              </div>
            ))
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