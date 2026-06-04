import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useMenuStore } from '../hooks/useMenuStore';
import { MENU_CATEGORIES } from '../data/menuData'; // Still needed for category labels

export default function MenuAdmin() {
  const { menuItems, loading, addMenuItem, updateMenuItem } = useMenuStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: 'starters',
    description: '',
    price: '',
    image: '',
    is_available: true
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('menu-images')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading image:', uploadError.message);
      alert(`Failed to upload image: ${uploadError.message}\n\nPlease ensure the "menu-images" bucket exists and has the correct policies.`);
    } else {
      const { data: { publicUrl } } = supabase.storage
        .from('menu-images')
        .getPublicUrl(filePath);
        
      setFormData(prev => ({ ...prev, image: publicUrl }));
    }
    setIsUploading(false);
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        category: item.category,
        description: item.description,
        price: item.price,
        image: item.image,
        is_available: item.is_available
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        category: 'starters',
        description: '',
        price: '',
        image: '',
        is_available: true
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      price: parseFloat(formData.price) || 0,
    };

    if (editingItem) {
      await updateMenuItem(editingItem.id, payload);
    } else {
      // Create new id if needed, though supabase might auto-increment if we set it up. 
      // But we used text for ID in menu_items so we should provide one.
      const id = `item-${Date.now()}`;
      await addMenuItem({ id, ...payload });
    }
    closeModal();
  };

  return (
    <div className="admin-panel">
      <header className="admin-panel__header">
        <div>
          <h2>Menu Catalog</h2>
          <p>Manage categories, items, pricing, and availability.</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>Add New Item</button>
      </header>
      
      <div className="admin-panel__content">
        {loading ? (
          <div style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--stone)' }}>
            Loading menu from Supabase...
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map(item => (
                <tr key={item.id}>
                  <td>
                    <img src={item.image} alt={item.name} className="admin-table__img" />
                  </td>
                  <td>
                    <strong>{item.name}</strong>
                    <div className="admin-table__desc">{item.description}</div>
                  </td>
                  <td>
                    <span className="admin-badge">
                      {MENU_CATEGORIES.find(c => c.id === item.category)?.label || item.category}
                    </span>
                  </td>
                  <td>£{item.price}</td>
                  <td>
                    <span className={`admin-badge ${item.is_available ? 'admin-badge--active' : ''}`}>
                      {item.is_available ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-outline" onClick={() => openModal(item)}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <header className="admin-modal__header">
              <h3>{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h3>
              <button className="admin-modal__close" onClick={closeModal} aria-label="Close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </header>
            <form className="admin-modal__form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="name">Item Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  className="form-input" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="category">Category</label>
                <select 
                  id="category" 
                  name="category" 
                  className="form-input" 
                  value={formData.category} 
                  onChange={handleInputChange}
                >
                  {MENU_CATEGORIES.map(c => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="price">Price (£)</label>
                <input 
                  type="number" 
                  id="price" 
                  name="price" 
                  className="form-input" 
                  min="0" 
                  step="0.01" 
                  value={formData.price} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="description">Description</label>
                <textarea 
                  id="description" 
                  name="description" 
                  className="form-textarea" 
                  rows="3" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Image Upload</label>
                <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
                  {formData.image ? (
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: 'var(--border)' }} 
                    />
                  ) : (
                    <div style={{ width: '80px', height: '80px', background: 'var(--cream)', borderRadius: 'var(--radius-sm)', border: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--stone)', fontSize: '12px' }}>
                      No image
                    </div>
                  )}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                      className="form-input" 
                      style={{ padding: '0.4rem' }}
                      disabled={isUploading}
                    />
                    <input 
                      type="text" 
                      id="image" 
                      name="image" 
                      className="form-input" 
                      value={formData.image} 
                      onChange={handleInputChange} 
                      placeholder="Or enter image URL directly..."
                      disabled={isUploading}
                    />
                    {isUploading && <span style={{ fontSize: '12px', color: 'var(--amber)' }}>Uploading to Supabase...</span>}
                  </div>
                </div>
              </div>

              <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: 'var(--space-2)' }}>
                <input 
                  type="checkbox" 
                  id="is_available" 
                  name="is_available" 
                  checked={formData.is_available} 
                  onChange={handleInputChange} 
                />
                <label htmlFor="is_available" style={{ margin: 0, fontWeight: 500 }}>Available on Menu</label>
              </div>

              <div className="admin-modal__actions">
                <button type="button" className="btn btn-outline" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingItem ? 'Save Changes' : 'Add Item'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
