import React, { useState } from 'react';
import { products, categories } from '../mock';

const Collections = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <section id="collections" className="section-padding">
      <div className="container">
        <div className="collections-header">
          <h2 className="hero-medium">Our Collections</h2>
          <p className="body-large collections-subtitle">
            Each piece meticulously crafted to perfection
          </p>
        </div>

        {/* Category Filter */}
        <div className="category-filter">
          <button 
            className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            All Collections
          </button>
          {categories.map(category => (
            <button 
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid-product-showcase">
          {filteredProducts.map(product => (
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
                <p className="product-card-description">{product.description}</p>
                <p className="product-card-details body-small">{product.details}</p>
                <p className="product-card-price">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Collections;