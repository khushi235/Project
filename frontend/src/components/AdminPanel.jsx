import React, { useState, useEffect } from 'react';
import { X, Plus, Edit2, Trash2, Save, Upload, LogOut } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Categories that use subcategory pricing
const PRICING_CATEGORIES = ['necklace', 'bracelet', 'bangle', 'pendant'];

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

const AdminPanel = ({ onClose, onLogout }) => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [subcategoryPricing, setSubcategoryPricing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  
  // Product form state
  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    subcategory: '',
    price: '',
    details: '',
    image: ''
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Category form state
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    subcategories: []
  });
  const [newSubcategory, setNewSubcategory] = useState({ id: '', name: '' });
  const [editingCategory, setEditingCategory] = useState(null);

  // Subcategory Pricing form state
  const [pricingForm, setPricingForm] = useState({
    category_id: '',
    subcategory_id: '',
    subcategory_name: '',
    image_url: '',
    price_table: []
  });
  const [newPriceRow, setNewPriceRow] = useState({ cttw: '', price_hi_si: '', price_fg_si: '', price_all_way: '', price_half_way: '' });
  const [editingPricing, setEditingPricing] = useState(null);

  // Check if category needs two price columns for clarity (necklace only)
  const needsClarityColumns = (categoryId) => {
    return categoryId === 'necklace';
  };

  // Check if category uses single HI-SI price column (bracelet, pendant, earring)
  const needsSinglePriceColumn = (categoryId) => {
    return ['bracelet', 'pendant', 'earring'].includes(categoryId);
  };

  // Check if category is bangle (uses All the Way / Half Way columns)
  const isBangleCategory = (categoryId) => {
    return categoryId === 'bangle';
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'products') {
        const res = await axios.get(`${API}/products`);
        setProducts(res.data);
        const catRes = await axios.get(`${API}/categories`);
        setCategories(catRes.data);
      } else if (activeTab === 'categories') {
        const res = await axios.get(`${API}/categories`);
        setCategories(res.data);
      } else if (activeTab === 'contacts') {
        const res = await axios.get(`${API}/contact`);
        setContacts(res.data);
      } else if (activeTab === 'pricing') {
        const [catRes, pricingRes] = await Promise.all([
          axios.get(`${API}/categories`),
          axios.get(`${API}/subcategory-pricing`)
        ]);
        setCategories(catRes.data);
        setSubcategoryPricing(pricingRes.data);
      }
    } catch (error) {
      toast.error('Failed to fetch data');
      console.error(error);
    }
    setLoading(false);
  };

  // Image upload handler
  const handleImageUpload = async (e, forPricing = false) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(`${API}/products/upload-image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const imageUrl = `${BACKEND_URL}${res.data.image_url}`;
      if (forPricing) {
        setPricingForm({ ...pricingForm, image_url: imageUrl });
      } else {
        setProductForm({ ...productForm, image: imageUrl });
      }
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
      console.error(error);
    }
    setUploading(false);
  };

  // Product CRUD operations
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await axios.put(`${API}/products/${editingProduct.id}`, productForm);
        toast.success('Product updated successfully');
      } else {
        await axios.post(`${API}/products`, productForm);
        toast.success('Product added successfully');
      }
      setProductForm({ name: '', category: '', subcategory: '', price: '', details: '', image: '' });
      setEditingProduct(null);
      fetchData();
    } catch (error) {
      toast.error('Failed to save product');
      console.error(error);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      subcategory: product.subcategory,
      price: product.price,
      details: product.details,
      image: product.image
    });
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`${API}/products/${id}`);
      toast.success('Product deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete product');
      console.error(error);
    }
  };

  // Category CRUD operations
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await axios.put(`${API}/categories/${editingCategory.id}`, categoryForm);
        toast.success('Category updated successfully');
      } else {
        await axios.post(`${API}/categories`, categoryForm);
        toast.success('Category added successfully');
      }
      setCategoryForm({ name: '', subcategories: [] });
      setEditingCategory(null);
      fetchData();
    } catch (error) {
      toast.error('Failed to save category');
      console.error(error);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      subcategories: category.subcategories
    });
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await axios.delete(`${API}/categories/${id}`);
      toast.success('Category deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete category');
      console.error(error);
    }
  };

  const handleAddSubcategory = () => {
    if (!newSubcategory.id || !newSubcategory.name) {
      toast.error('Please fill in both ID and Name');
      return;
    }
    setCategoryForm({
      ...categoryForm,
      subcategories: [...categoryForm.subcategories, newSubcategory]
    });
    setNewSubcategory({ id: '', name: '' });
  };

  const handleRemoveSubcategory = (index) => {
    const updated = [...categoryForm.subcategories];
    updated.splice(index, 1);
    setCategoryForm({ ...categoryForm, subcategories: updated });
  };

  const handleDeleteContact = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return;
    try {
      await axios.delete(`${API}/contact/${id}`);
      toast.success('Contact deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete contact');
      console.error(error);
    }
  };

  // Subcategory Pricing CRUD operations
  const handlePricingSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPricing) {
        await axios.put(`${API}/subcategory-pricing/${editingPricing.id}`, {
          image_url: pricingForm.image_url,
          price_table: pricingForm.price_table
        });
        toast.success('Pricing updated successfully');
      } else {
        await axios.post(`${API}/subcategory-pricing`, pricingForm);
        toast.success('Pricing added successfully');
      }
      setPricingForm({ category_id: '', subcategory_id: '', subcategory_name: '', image_url: '', price_table: [] });
      setEditingPricing(null);
      fetchData();
    } catch (error) {
      toast.error('Failed to save pricing');
      console.error(error);
    }
  };

  const handleEditPricing = (pricing) => {
    setEditingPricing(pricing);
    setPricingForm({
      category_id: pricing.category_id,
      subcategory_id: pricing.subcategory_id,
      subcategory_name: pricing.subcategory_name,
      image_url: pricing.image_url,
      price_table: pricing.price_table || []
    });
  };

  const handleDeletePricing = async (id) => {
    if (!window.confirm('Are you sure you want to delete this pricing?')) return;
    try {
      await axios.delete(`${API}/subcategory-pricing/${id}`);
      toast.success('Pricing deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete pricing');
      console.error(error);
    }
  };

  const handleAddPriceRow = () => {
    if (!newPriceRow.cttw) {
      toast.error('Please fill in CTTW');
      return;
    }
    
    // Validate based on category type
    if (needsClarityColumns(pricingForm.category_id)) {
      if (!newPriceRow.price_hi_si && !newPriceRow.price_fg_si) {
        toast.error('Please fill in at least one price');
        return;
      }
    } else if (isBangleCategory(pricingForm.category_id)) {
      if (!newPriceRow.price_all_way && !newPriceRow.price_half_way) {
        toast.error('Please fill in at least one price');
        return;
      }
    } else if (needsSinglePriceColumn(pricingForm.category_id)) {
      if (!newPriceRow.price_hi_si) {
        toast.error('Please fill in the price');
        return;
      }
    } else {
      if (!newPriceRow.price_fg_si) {
        toast.error('Please fill in the price');
        return;
      }
    }
    
    setPricingForm({
      ...pricingForm,
      price_table: [...pricingForm.price_table, newPriceRow]
    });
    setNewPriceRow({ cttw: '', price_hi_si: '', price_fg_si: '', price_all_way: '', price_half_way: '' });
  };

  const handleRemovePriceRow = (index) => {
    const updated = [...pricingForm.price_table];
    updated.splice(index, 1);
    setPricingForm({ ...pricingForm, price_table: updated });
  };

  const getSubcategories = (forPricing = false) => {
    const categoryId = forPricing ? pricingForm.category_id : productForm.category;
    const cat = categories.find(c => c.id === categoryId);
    return cat ? cat.subcategories : [];
  };

  const getPricingCategories = () => {
    return categories.filter(c => 
      PRICING_CATEGORIES.includes(c.id) || 
      c.name.toLowerCase() === 'earrings'
    );
  };

  const getSortedProducts = () => {
    const sorted = [...products];
    if (sortBy === 'name') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'category') {
      sorted.sort((a, b) => a.category.localeCompare(b.category));
    } else if (sortBy === 'price') {
      sorted.sort((a, b) => a.price.localeCompare(b.price));
    }
    return sorted;
  };

  return (
    <div className="admin-panel-overlay">
      <div className="admin-panel">
        <div className="admin-header">
          <h2 className="hero-medium">Admin Panel</h2>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button onClick={onLogout} className="admin-logout-btn" title="Logout">
              <LogOut size={18} />
              Logout
            </button>
            <button onClick={onClose} className="admin-close-btn">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="admin-tabs">
          <button 
            className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            Products
          </button>
          <button 
            className={`admin-tab ${activeTab === 'pricing' ? 'active' : ''}`}
            onClick={() => setActiveTab('pricing')}
          >
            Price Tables
          </button>
          <button 
            className={`admin-tab ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            Categories
          </button>
          <button 
            className={`admin-tab ${activeTab === 'contacts' ? 'active' : ''}`}
            onClick={() => setActiveTab('contacts')}
          >
            Contact Inquiries
          </button>
        </div>

        <div className="admin-content">
          {loading ? (
            <div className="admin-loading">Loading...</div>
          ) : (
            <>
              {/* Products Tab */}
              {activeTab === 'products' && (
                <div className="admin-section">
                  <div className="admin-form-container">
                    <h3 className="heading-3">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                    <p className="body-small" style={{ marginBottom: '16px', color: 'var(--text-light)' }}>
                      Add individual products to any category. Select "Fancy" subcategory for custom/unique items.
                    </p>
                    <form onSubmit={handleProductSubmit} className="admin-form">
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Product Name</label>
                          <input
                            type="text"
                            className="form-input"
                            value={productForm.name}
                            onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Category</label>
                          <select
                            className="form-input"
                            value={productForm.category}
                            onChange={(e) => setProductForm({ ...productForm, category: e.target.value, subcategory: '' })}
                            required
                          >
                            <option value="">Select Category</option>
                            {categories.filter(c => c.id !== 'all').map(cat => (
                              <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="form-group">
                          <label className="form-label">Subcategory</label>
                          <select
                            className="form-input"
                            value={productForm.subcategory}
                            onChange={(e) => setProductForm({ ...productForm, subcategory: e.target.value })}
                            required
                            disabled={!productForm.category}
                          >
                            <option value="">Select Subcategory</option>
                            {getSubcategories().map(sub => (
                              <option key={sub.id} value={sub.id}>{sub.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Price</label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="e.g., Starting at $8,500"
                            value={productForm.price}
                            onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Carat Weight / Details</label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="e.g., 5.0 ct total weight"
                            value={productForm.details}
                            onChange={(e) => setProductForm({ ...productForm, details: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Product Image</label>
                        <div className="image-upload-wrapper">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, false)}
                            className="file-input"
                            id="image-upload"
                          />
                          <label htmlFor="image-upload" className="file-input-label">
                            <Upload size={20} />
                            {uploading ? 'Uploading...' : 'Upload Image'}
                          </label>
                          {productForm.image && (
                            <div className="image-preview">
                              <img src={productForm.image} alt="Preview" />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="form-actions">
                        <button type="submit" className="btn-primary">
                          <Save size={16} />
                          {editingProduct ? 'Update Product' : 'Add Product'}
                        </button>
                        {editingProduct && (
                          <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => {
                              setEditingProduct(null);
                              setProductForm({ name: '', category: '', subcategory: '', price: '', details: '', image: '' });
                            }}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  </div>

                  <div className="admin-list-container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h3 className="heading-3">All Products ({products.length})</h3>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <label className="body-small" style={{ color: 'var(--text-secondary)' }}>Sort by:</label>
                        <select 
                          value={sortBy} 
                          onChange={(e) => setSortBy(e.target.value)}
                          className="sort-select"
                        >
                          <option value="name">Name</option>
                          <option value="category">Category</option>
                          <option value="price">Price</option>
                        </select>
                      </div>
                    </div>
                    <div className="admin-product-grid">
                      {getSortedProducts().map(product => (
                        <div key={product.id} className="admin-product-card">
                          <div className="admin-product-badge">
                            <button onClick={() => handleEditProduct(product)} className="admin-edit-badge" title="Edit Product">
                              <Edit2 size={14} />
                              Edit
                            </button>
                            <button onClick={() => handleDeleteProduct(product.id)} className="admin-delete-badge" title="Delete Product">
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <img src={product.image} alt={product.name} className="admin-product-image" />
                          <div className="admin-product-info">
                            <h4>{product.name}</h4>
                            <p className="body-small">{product.details}</p>
                            <p className="body-small">{formatPrice(product.price)}</p>
                            <p className="body-small" style={{ fontSize: '11px', color: 'var(--text-light)' }}>
                              {product.category} - {product.subcategory}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Subcategory Pricing Tab */}
              {activeTab === 'pricing' && (
                <div className="admin-section">
                  <div className="admin-form-container">
                    <h3 className="heading-3">{editingPricing ? 'Edit Price Table' : 'Add New Price Table'}</h3>
                    <p className="body-small" style={{ marginBottom: '16px', color: 'var(--text-light)' }}>
                      For Necklaces, Bracelets, Bangles, Pendants & Earrings
                    </p>
                    <form onSubmit={handlePricingSubmit} className="admin-form">
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Category</label>
                          <select
                            className="form-input"
                            value={pricingForm.category_id}
                            onChange={(e) => setPricingForm({ ...pricingForm, category_id: e.target.value, subcategory_id: '', subcategory_name: '' })}
                            required
                            disabled={editingPricing}
                          >
                            <option value="">Select Category</option>
                            {getPricingCategories().map(cat => (
                              <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="form-group">
                          <label className="form-label">Subcategory</label>
                          <select
                            className="form-input"
                            value={pricingForm.subcategory_id}
                            onChange={(e) => {
                              const sub = getSubcategories(true).find(s => s.id === e.target.value);
                              setPricingForm({ 
                                ...pricingForm, 
                                subcategory_id: e.target.value,
                                subcategory_name: sub ? sub.name : ''
                              });
                            }}
                            required
                            disabled={!pricingForm.category_id || editingPricing}
                          >
                            <option value="">Select Subcategory</option>
                            {getSubcategories(true).map(sub => (
                              <option key={sub.id} value={sub.id}>{sub.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Subcategory Image</label>
                        <div className="image-upload-wrapper">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, true)}
                            className="file-input"
                            id="pricing-image-upload"
                          />
                          <label htmlFor="pricing-image-upload" className="file-input-label">
                            <Upload size={20} />
                            {uploading ? 'Uploading...' : 'Upload Image'}
                          </label>
                          {pricingForm.image_url && (
                            <div className="image-preview">
                              <img src={pricingForm.image_url} alt="Preview" />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          Price Table 
                          {needsClarityColumns(pricingForm.category_id) && ' (CTTW, HI-SI Price, FG-SI Price)'}
                          {needsSinglePriceColumn(pricingForm.category_id) && ' (CTTW, HI-SI Price)'}
                          {isBangleCategory(pricingForm.category_id) && ' (CTTW, All the Way, Half Way)'}
                          {!needsClarityColumns(pricingForm.category_id) && !needsSinglePriceColumn(pricingForm.category_id) && !isBangleCategory(pricingForm.category_id) && ' (CTTW & Price)'}
                        </label>
                        <div className="price-row-input">
                          <input
                            type="text"
                            className="form-input"
                            placeholder="CTTW (e.g., 3)"
                            value={newPriceRow.cttw}
                            onChange={(e) => setNewPriceRow({ ...newPriceRow, cttw: e.target.value })}
                          />
                          {needsClarityColumns(pricingForm.category_id) ? (
                            <>
                              <input
                                type="text"
                                className="form-input"
                                placeholder="HI-SI Price"
                                value={newPriceRow.price_hi_si}
                                onChange={(e) => setNewPriceRow({ ...newPriceRow, price_hi_si: e.target.value })}
                              />
                              <input
                                type="text"
                                className="form-input"
                                placeholder="FG-SI Price"
                                value={newPriceRow.price_fg_si}
                                onChange={(e) => setNewPriceRow({ ...newPriceRow, price_fg_si: e.target.value })}
                              />
                            </>
                          ) : needsSinglePriceColumn(pricingForm.category_id) ? (
                            <input
                              type="text"
                              className="form-input"
                              placeholder="HI-SI Price"
                              value={newPriceRow.price_hi_si}
                              onChange={(e) => setNewPriceRow({ ...newPriceRow, price_hi_si: e.target.value })}
                            />
                          ) : isBangleCategory(pricingForm.category_id) ? (
                            <>
                              <input
                                type="text"
                                className="form-input"
                                placeholder="All the Way Price"
                                value={newPriceRow.price_all_way}
                                onChange={(e) => setNewPriceRow({ ...newPriceRow, price_all_way: e.target.value })}
                              />
                              <input
                                type="text"
                                className="form-input"
                                placeholder="Half Way Price"
                                value={newPriceRow.price_half_way}
                                onChange={(e) => setNewPriceRow({ ...newPriceRow, price_half_way: e.target.value })}
                              />
                            </>
                          ) : (
                            <input
                              type="text"
                              className="form-input"
                              placeholder="Price (e.g., $3,500)"
                              value={newPriceRow.price_fg_si}
                              onChange={(e) => setNewPriceRow({ ...newPriceRow, price_fg_si: e.target.value })}
                            />
                          )}
                          <button type="button" onClick={handleAddPriceRow} className="btn-icon-add">
                            <Plus size={20} />
                          </button>
                        </div>
                        {pricingForm.price_table.length > 0 && (
                          <div className="price-rows-list">
                            {pricingForm.price_table.map((row, index) => (
                              <div key={index} className="price-row-item">
                                <span>
                                  <strong>{row.cttw}</strong> cttw
                                  {needsClarityColumns(pricingForm.category_id) ? (
                                    <> - HI-SI: {formatPrice(row.price_hi_si) || '-'} | FG-SI: {formatPrice(row.price_fg_si) || '-'}</>
                                  ) : needsSinglePriceColumn(pricingForm.category_id) ? (
                                    <> - HI-SI: {formatPrice(row.price_hi_si) || '-'}</>
                                  ) : isBangleCategory(pricingForm.category_id) ? (
                                    <> - All Way: {formatPrice(row.price_all_way) || '-'} | Half: {formatPrice(row.price_half_way) || '-'}</>
                                  ) : (
                                    <> - {formatPrice(row.price_fg_si || row.price)}</>
                                  )}
                                </span>
                                <button type="button" onClick={() => handleRemovePriceRow(index)} className="btn-remove">
                                  <X size={16} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="form-actions">
                        <button type="submit" className="btn-primary">
                          <Save size={16} />
                          {editingPricing ? 'Update Price Table' : 'Add Price Table'}
                        </button>
                        {editingPricing && (
                          <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => {
                              setEditingPricing(null);
                              setPricingForm({ category_id: '', subcategory_id: '', subcategory_name: '', image_url: '', price_table: [] });
                            }}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  </div>

                  <div className="admin-list-container">
                    <h3 className="heading-3">All Price Tables ({subcategoryPricing.length})</h3>
                    <div className="admin-pricing-grid">
                      {subcategoryPricing.map(pricing => (
                        <div key={pricing.id} className="admin-pricing-card">
                          <img src={pricing.image_url} alt={pricing.subcategory_name} className="admin-pricing-image" />
                          <div className="admin-pricing-info">
                            <h4>{pricing.subcategory_name}</h4>
                            <p className="admin-pricing-table-preview">
                              {pricing.price_table?.length || 0} price rows
                            </p>
                            <div className="admin-pricing-actions">
                              <button onClick={() => handleEditPricing(pricing)} className="admin-edit-inline-btn">
                                <Edit2 size={14} />
                                Edit
                              </button>
                              <button onClick={() => handleDeletePricing(pricing.id)} className="admin-delete-inline-btn">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Categories Tab */}
              {activeTab === 'categories' && (
                <div className="admin-section">
                  <div className="admin-form-container">
                    <h3 className="heading-3">{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
                    <form onSubmit={handleCategorySubmit} className="admin-form">
                      <div className="form-group">
                        <label className="form-label">Category Name</label>
                        <input
                          type="text"
                          className="form-input"
                          value={categoryForm.name}
                          onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Subcategories</label>
                        <div className="subcategory-input-group">
                          <input
                            type="text"
                            className="form-input"
                            placeholder="ID (e.g., tennis)"
                            value={newSubcategory.id}
                            onChange={(e) => setNewSubcategory({ ...newSubcategory, id: e.target.value })}
                          />
                          <input
                            type="text"
                            className="form-input"
                            placeholder="Name (e.g., Tennis)"
                            value={newSubcategory.name}
                            onChange={(e) => setNewSubcategory({ ...newSubcategory, name: e.target.value })}
                          />
                          <button type="button" onClick={handleAddSubcategory} className="btn-icon-add">
                            <Plus size={20} />
                          </button>
                        </div>
                        {categoryForm.subcategories.length > 0 && (
                          <div className="subcategory-list">
                            {categoryForm.subcategories.map((sub, index) => (
                              <div key={index} className="subcategory-item">
                                <span>{sub.name} ({sub.id})</span>
                                <button type="button" onClick={() => handleRemoveSubcategory(index)} className="btn-remove">
                                  <X size={16} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="form-actions">
                        <button type="submit" className="btn-primary">
                          <Save size={16} />
                          {editingCategory ? 'Update Category' : 'Add Category'}
                        </button>
                        {editingCategory && (
                          <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => {
                              setEditingCategory(null);
                              setCategoryForm({ name: '', subcategories: [] });
                            }}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  </div>

                  <div className="admin-list-container">
                    <h3 className="heading-3">All Categories</h3>
                    <div className="category-list">
                      {categories.filter(c => c.id !== 'all').map(category => (
                        <div key={category.id} className="category-card">
                          <div className="category-info">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <h4>{category.name}</h4>
                              <button onClick={() => handleEditCategory(category)} className="admin-edit-inline-btn" title="Edit Category">
                                <Edit2 size={14} />
                                Edit
                              </button>
                              <button onClick={() => handleDeleteCategory(category.id)} className="admin-delete-inline-btn" title="Delete Category">
                                <Trash2 size={14} />
                              </button>
                            </div>
                            <p className="body-small">
                              {category.subcategories.length} subcategories: {category.subcategories.map(s => s.name).join(', ')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Contacts Tab */}
              {activeTab === 'contacts' && (
                <div className="admin-section">
                  <h3 className="heading-3">Contact Inquiries ({contacts.length})</h3>
                  <div className="contact-list">
                    {contacts.map(contact => (
                      <div key={contact.id} className="contact-card">
                        <div className="contact-info">
                          <h4>{contact.name}</h4>
                          <p className="body-small">{contact.email} {contact.phone && `• ${contact.phone}`}</p>
                          <p className="body-regular">{contact.message}</p>
                          <p className="body-small">{new Date(contact.created_at).toLocaleDateString()}</p>
                        </div>
                        <button onClick={() => handleDeleteContact(contact.id)} className="admin-icon-btn delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
