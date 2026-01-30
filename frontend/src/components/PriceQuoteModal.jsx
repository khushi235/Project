import React from 'react';
import { X } from 'lucide-react';

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

const PriceQuoteModal = ({ pricing, onClose }) => {
  if (!pricing) return null;

  return (
    <div className="price-quote-overlay" onClick={onClose}>
      <div className="price-quote-modal" onClick={(e) => e.stopPropagation()}>
        <button className="price-quote-close" onClick={onClose}>
          <X size={24} />
        </button>
        
        <div className="price-quote-content">
          <div className="price-quote-image-container">
            <img 
              src={pricing.image_url} 
              alt={pricing.subcategory_name}
              className="price-quote-image"
            />
          </div>
          
          <div className="price-quote-info">
            <h2 className="price-quote-title">{pricing.subcategory_name}</h2>
            <p className="price-quote-subtitle">Price Starting At</p>
            
            <div className="price-quote-table-container">
              <table className="price-quote-table">
                <thead>
                  <tr>
                    <th>CTTW</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {pricing.price_table && pricing.price_table.map((row, index) => (
                    <tr key={index}>
                      <td>{row.cttw}</td>
                      <td>{formatPrice(row.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <p className="price-quote-note">Contact us for custom orders and special requests</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceQuoteModal;
