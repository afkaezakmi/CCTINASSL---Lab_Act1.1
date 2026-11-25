import React, { useState, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Inventory.css';

const STATIC_ITEMS = [
  { id: '1', name: 'AMD Ryzen 7 7800X3D Processor', sku: 'CPU-7800X3D', category: 'Processors (CPU)', supplier: 'AMD Official Dist.', price: 389.00, qty: 18, minQty: 6, location: 'Bin A-01' },
  { id: '2', name: 'NVIDIA RTX 4070 Super 12GB OC', sku: 'GPU-4070S', category: 'Graphics Cards', supplier: 'ASUS ROG Supply', price: 599.99, qty: 4, minQty: 5, location: 'Vault B-02' },
  { id: '3', name: 'Corsair Vengeance 32GB (2x16GB) DDR5-6000', sku: 'RAM-DDR5-32', category: 'Memory (RAM)', supplier: 'Corsair Components', price: 114.50, qty: 26, minQty: 10, location: 'Bin A-08' },
  { id: '4', name: 'Samsung 990 PRO 2TB NVMe M.2 SSD', sku: 'SSD-990P-2T', category: 'Storage (NVMe/SSD)', supplier: 'Samsung Tech Dist.', price: 169.00, qty: 0, minQty: 8, location: 'Bin A-12' },
  { id: '5', name: 'MSI MAG B650 Tomahawk WiFi ATX', sku: 'MB-B650-TOM', category: 'Motherboards', supplier: 'MSI Distribution', price: 199.00, qty: 11, minQty: 4, location: 'Rack C-04' },
  { id: '6', name: 'Seasonic Focus GX-850 80+ Gold Modular PSU', sku: 'PSU-GX850', category: 'Power Supplies', supplier: 'Seasonic Direct', price: 139.99, qty: 3, minQty: 6, location: 'Rack D-02' },
  { id: '7', name: 'Thermalright Peerless Assassin 120 SE', sku: 'CLR-PA120', category: 'Cooling & Fans', supplier: 'Titan Cooling Co.', price: 35.90, qty: 22, minQty: 8, location: 'Bin C-09' },
  { id: '8', name: 'Lian Li Lancool 216 Mesh Mid-Tower Case', sku: 'CAS-LL216', category: 'PC Cases', supplier: 'Lian Li Hardware', price: 99.99, qty: 9, minQty: 3, location: 'Bay E-01' }
];

const EMPTY_FORM = { name: '', sku: '', category: '', supplier: '', price: '', qty: '', minQty: '', location: '' };

function Inventory() {
  const [inventory, setInventory] = useState(STATIC_ITEMS);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2800);
  };

  const getStockStatus = (item) => {
    if (item.qty === 0) return { key: 'out', label: 'Out of Stock', badge: 'badge-danger' };
    if (item.qty <= item.minQty) return { key: 'low', label: 'Low Stock', badge: 'badge-warning' };
    return { key: 'in', label: 'In Stock', badge: 'badge-success' };
  };

  const categories = useMemo(() => [...new Set(inventory.map((i) => i.category))].sort(), [inventory]);
  const alertCount = useMemo(() => inventory.filter((i) => i.qty <= i.minQty).length, [inventory]);

  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        item.name.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.supplier.toLowerCase().includes(q);
      const matchesCat = categoryFilter === 'all' || item.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || getStockStatus(item).key === statusFilter;
      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [inventory, searchQuery, categoryFilter, statusFilter]);

  const adjustStock = (id, delta) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const newQty = Math.max(0, item.qty + delta);
        showToast(`Updated ${item.sku} stock to ${newQty}`);
        return { ...item, qty: newQty };
      })
    );
  };

  const deleteItem = (item) => {
    if (!window.confirm(`Remove "${item.name}" from catalog?`)) return;
    setInventory((prev) => prev.filter((i) => i.id !== item.id));
    showToast('Component removed');
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      sku: item.sku,
      category: item.category,
      supplier: item.supplier,
      price: item.price,
      qty: item.qty,
      minQty: item.minQty,
      location: item.location || ''
    });
    setModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name.trim(),
      sku: formData.sku.trim().toUpperCase(),
      category: formData.category.trim(),
      supplier: formData.supplier.trim(),
      price: parseFloat(formData.price),
      qty: parseInt(formData.qty, 10),
      minQty: parseInt(formData.minQty, 10),
      location: formData.location.trim()
    };

    if (editingId) {
      setInventory((prev) => prev.map((i) => (i.id === editingId ? { ...i, ...payload } : i)));
      showToast('Component updated');
    } else {
      setInventory((prev) => [{ id: Date.now().toString(), ...payload }, ...prev]);
      showToast('New component added');
    }
    setModalOpen(false);
  };

  return (
    <div className="app-layout">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <rect x="4" y="4" width="16" height="16" rx="2" />
                <rect x="9" y="9" width="6" height="6" />
                <line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" />
                <line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" />
                <line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" />
                <line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" />
              </svg>
            </div>
            <div className="brand-text">
              <span className="brand-title">TechWorth</span>
              <span className="brand-sub">PC Parts Inventory</span>
            </div>
          </div>
          <button className="icon-btn mobile-only" onClick={() => setSidebarOpen(false)}>✕</button>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
            </svg>
            Dashboard
          </NavLink>
          <NavLink to="/inventory" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 7h-9" /><path d="M14 17H5" /><circle cx="17" cy="17" r="3" /><circle cx="7" cy="7" r="3" />
            </svg>
            PC Parts Catalog
            <span className="nav-badge">{alertCount}</span>
          </NavLink>
          <NavLink to="/stock-movements" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            Stock Movements
          </NavLink>
          <NavLink to="/suppliers" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Distributors
          </NavLink>
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-btn mobile-only" onClick={() => setSidebarOpen(true)}>☰</button>
            <div>
              <h1 className="page-title">PC Parts Catalog</h1>
              <p className="page-subtitle">Manage CPUs, GPUs, motherboards, RAM, storage, and stock levels</p>
            </div>
          </div>
          <div className="topbar-actions">
            <button className="btn btn-primary" onClick={openAddModal}>+ Add Component</button>
          </div>
        </header>

        <section className="view-section active">
          <div className="card">
            <div className="toolbar">
              <div className="search-box">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by model name, part SKU, or distributor..."
                />
              </div>
              <div className="filters">
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                  <option value="all">All Categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="all">All Statuses</option>
                  <option value="in">In Stock</option>
                  <option value="low">Low Stock</option>
                  <option value="out">Out of Stock</option>
                </select>
              </div>
            </div>

            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Component / Part SKU</th>
                    <th>Category</th>
                    <th>Distributor</th>
                    <th>Unit Price</th>
                    <th>Stock Level</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.length === 0 ? (
                    <tr><td colSpan="7" className="empty-cell">No matching hardware parts found.</td></tr>
                  ) : (
                    filteredInventory.map((item) => {
                      const st = getStockStatus(item);
                      return (
                        <tr key={item.id}>
                          <td>
                            <div className="item-title">{item.name}</div>
                            <div className="item-sub">{item.sku} {item.location ? `• ${item.location}` : ''}</div>
                          </td>
                          <td><span className="chip">{item.category}</span></td>
                          <td>{item.supplier}</td>
                          <td>${item.price.toFixed(2)}</td>
                          <td>
                            <div className="qty-control">
                              <button className="qty-btn" onClick={() => adjustStock(item.id, -1)}>−</button>
                              <span className="qty-val">{item.qty}</span>
                              <button className="qty-btn" onClick={() => adjustStock(item.id, 1)}>+</button>
                            </div>
                          </td>
                          <td><span className={`badge ${st.badge}`}>{st.label}</span></td>
                          <td className="text-right">
                            <button className="btn-icon" onClick={() => openEditModal(item)} title="Edit">✎</button>
                            <button className="btn-icon danger" onClick={() => deleteItem(item)} title="Delete">🗑</button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      {modalOpen && (
        <div className="modal-backdrop open">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingId ? 'Edit Component' : 'Add Hardware Component'}</h2>
              <button className="icon-btn" onClick={() => setModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleFormSubmit} className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Component Name *</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Part SKU *</label>
                  <input type="text" required value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <input type="text" list="hwCategories" required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
                  <datalist id="hwCategories">
                    <option value="Processors (CPU)" />
                    <option value="Graphics Cards" />
                    <option value="Motherboards" />
                    <option value="Memory (RAM)" />
                    <option value="Storage (NVMe/SSD)" />
                    <option value="Power Supplies" />
                    <option value="Cooling & Fans" />
                    <option value="PC Cases" />
                  </datalist>
                </div>
                <div className="form-group">
                  <label>Distributor *</label>
                  <input type="text" required value={formData.supplier} onChange={(e) => setFormData({ ...formData, supplier: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Unit Price ($) *</label>
                  <input type="number" step="0.01" min="0" required value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Quantity in Stock *</label>
                  <input type="number" min="0" required value={formData.qty} onChange={(e) => setFormData({ ...formData, qty: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Reorder Threshold *</label>
                  <input type="number" min="0" required value={formData.minQty} onChange={(e) => setFormData({ ...formData, minQty: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>ESD Bin / Rack Location</label>
                  <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Component</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={`toast ${toastMsg ? 'show' : ''}`}>{toastMsg}</div>
    </div>
  );
}

export default Inventory;