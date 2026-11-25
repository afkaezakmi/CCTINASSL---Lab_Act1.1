import React, { useState, useMemo } from 'react';
import { NavLink, Link } from 'react-router-dom';
import '../styles/Home.css';

const STATIC_ITEMS = [
  { id: '1', name: 'AMD Ryzen 7 7800X3D Processor', sku: 'CPU-7800X3D', category: 'Processors (CPU)', supplier: 'AMD Official Dist.', price: 389.00, qty: 18, minQty: 6, location: 'Bin A-01' },
  { id: '2', name: 'NVIDIA RTX 4070 Super 12GB OC', sku: 'GPU-4070S', category: 'Graphics Cards', supplier: 'ASUS ROG Supply', price: 599.99, qty: 4, minQty: 5, location: 'Vault B-02' },
  { id: '3', name: 'Corsair Vengeance 32GB (2x16GB) DDR5-6000', sku: 'RAM-DDR5-32', category: 'Memory (RAM)', supplier: 'Corsair Components', price: 114.50, qty: 26, minQty: 10, location: 'Bin A-08' },
  { id: '4', name: 'Samsung 990 PRO 2TB NVMe M.2 SSD', sku: 'SSD-990P-2T', category: 'Storage (NVMe/SSD)', supplier: 'Samsung Tech Dist.', price: 169.00, qty: 0, minQty: 8, location: 'Bin A-12' },
  { id: '5', name: 'MSI MAG B650 Tomahawk WiFi ATX', sku: 'MB-B650-TOM', category: 'Motherboards', supplier: 'MSI Distribution', price: 199.00, qty: 11, minQty: 4, location: 'Rack C-04' },
  { id: '6', name: 'Seasonic Focus GX-850 80+ Gold Modular PSU', sku: 'PSU-GX850', category: 'Power Supplies', supplier: 'Seasonic Direct', price: 139.99, qty: 3, minQty: 6, location: 'Rack D-02' },
  { id: '7', name: 'Thermalright Peerless Assassin 120 SE', sku: 'CLR-PA120', category: 'Cooling & Fans', supplier: 'Titan Cooling Co.', price: 35.90, qty: 22, minQty: 8, location: 'Bin C-09' }
];

const EMPTY_FORM = { name: '', sku: '', category: '', supplier: '', price: '', qty: '', minQty: '', location: '' };

function Home() {
  const [inventory, setInventory] = useState(STATIC_ITEMS);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
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

  const metrics = useMemo(() => {
    const totalValue = inventory.reduce((sum, item) => sum + item.price * item.qty, 0);
    const totalUnits = inventory.reduce((sum, item) => sum + item.qty, 0);
    const categories = [...new Set(inventory.map((i) => i.category))].sort();
    const lowItems = inventory.filter((i) => i.qty > 0 && i.qty <= i.minQty);
    const outItems = inventory.filter((i) => i.qty === 0);

    const categoryTotals = categories
      .map((cat) => {
        const itemsInCat = inventory.filter((i) => i.category === cat);
        return {
          cat,
          units: itemsInCat.reduce((s, i) => s + i.qty, 0),
          val: itemsInCat.reduce((s, i) => s + i.price * i.qty, 0)
        };
      })
      .sort((a, b) => b.val - a.val);

    return {
      totalValue,
      totalUnits,
      categories,
      lowItems,
      outItems,
      alertCount: lowItems.length + outItems.length,
      priorityItems: [...outItems, ...lowItems].slice(0, 5),
      categoryTotals
    };
  }, [inventory]);

  const adjustStock = (id, delta) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const newQty = Math.max(0, item.qty + delta);
        showToast(`Restocked ${item.sku} (+${delta} units)`);
        return { ...item, qty: newQty };
      })
    );
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const payload = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      sku: formData.sku.trim().toUpperCase(),
      category: formData.category.trim(),
      supplier: formData.supplier.trim(),
      price: parseFloat(formData.price),
      qty: parseInt(formData.qty, 10),
      minQty: parseInt(formData.minQty, 10),
      location: formData.location.trim()
    };
    setInventory((prev) => [payload, ...prev]);
    showToast(`Added ${payload.sku} to stockroom`);
    setFormData(EMPTY_FORM);
    setModalOpen(false);
  };

  const resetDemoData = () => {
    setInventory(STATIC_ITEMS);
    showToast('Default hardware catalog restored');
  };

  return (
    <div className="app-layout">
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
      )}

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
          <button type="button" className="icon-btn mobile-only" onClick={() => setSidebarOpen(false)} aria-label="Close navigation">
            ✕
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Primary">
          <NavLink to="/" end onClick={() => setSidebarOpen(false)} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
            </svg>
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/inventory" onClick={() => setSidebarOpen(false)} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 7h-9" /><path d="M14 17H5" /><circle cx="17" cy="17" r="3" /><circle cx="7" cy="7" r="3" />
            </svg>
            <span>PC Parts Catalog</span>
            {metrics.alertCount > 0 && <span className="nav-badge">{metrics.alertCount}</span>}
          </NavLink>

          <NavLink to="/stock-movements" onClick={() => setSidebarOpen(false)} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            <span>Stock Movements</span>
          </NavLink>

          <NavLink to="/suppliers" onClick={() => setSidebarOpen(false)} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span>Distributors</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button type="button" className="btn btn-ghost btn-sm full-width" onClick={resetDemoData}>
            Reset Demo Data
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button type="button" className="icon-btn mobile-only" onClick={() => setSidebarOpen(true)} aria-label="Open navigation">
              ☰
            </button>
            <div>
              <h1 className="page-title">Hardware Dashboard</h1>
              <p className="page-subtitle">Overview of PC components, stock valuation, and RMA/restock alerts</p>
            </div>
          </div>
          <div className="topbar-actions">
            <span className="stock-pill">
              <span className="status-dot" />
              <strong>{metrics.totalUnits}</strong> units • <strong>{metrics.categories.length}</strong> categories
            </span>
            <button type="button" className="btn btn-primary" onClick={() => setModalOpen(true)}>
              + Add Component
            </button>
          </div>
        </header>

        <section className="view-section active">
          {/* KPI Cards */}
          <div className="kpi-grid">
            <div className="kpi-card primary">
              <div className="kpi-top">
                <span className="kpi-label">Total Hardware Value</span>
                <span className="kpi-icon blue">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </span>
              </div>
              <strong className="kpi-value">
                ${metrics.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </strong>
              <span className="kpi-meta">{metrics.totalUnits.toLocaleString()} components in stockroom</span>
            </div>

            <div className="kpi-card info">
              <div className="kpi-top">
                <span className="kpi-label">Active Part SKUs</span>
                <span className="kpi-icon slate">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  </svg>
                </span>
              </div>
              <strong className="kpi-value">{inventory.length}</strong>
              <span className="kpi-meta">Across {metrics.categories.length} hardware categories</span>
            </div>

            <div className="kpi-card warning">
              <div className="kpi-top">
                <span className="kpi-label">Low Stock Parts</span>
                <span className="kpi-icon amber">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </span>
              </div>
              <strong className="kpi-value">{metrics.lowItems.length}</strong>
              <span className="kpi-meta">Components at or below reorder level</span>
            </div>

            <div className="kpi-card danger">
              <div className="kpi-top">
                <span className="kpi-label">Out of Stock</span>
                <span className="kpi-icon red">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                </span>
              </div>
              <strong className="kpi-value">{metrics.outItems.length}</strong>
              <span className="kpi-meta">Backordered / urgent restock</span>
            </div>
          </div>

          {/* Analytics & Restock Priority Grid */}
          <div className="dashboard-grid">
            <div className="card">
              <div className="card-header">
                <div>
                  <h2>Valuation by Component Category</h2>
                  <p className="card-sub">Share of total stockroom inventory value</p>
                </div>
                <span className="pill-tag">{metrics.categories.length} groups</span>
              </div>

              <div className="category-bars">
                {metrics.categoryTotals.map(({ cat, units, val }) => {
                  const pct = metrics.totalValue > 0 ? Math.round((val / metrics.totalValue) * 100) : 0;
                  return (
                    <div className="cat-bar-item" key={cat}>
                      <div className="cat-bar-top">
                        <div>
                          <span className="cat-name">{cat}</span>
                          <span className="cat-units">{units} units</span>
                        </div>
                        <span className="cat-amount">
                          ${val.toLocaleString('en-US', { minimumFractionDigits: 2 })} <em>({pct}%)</em>
                        </span>
                      </div>
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div>
                  <h2>Restock Priority</h2>
                  <p className="card-sub">Parts at or below reorder threshold</p>
                </div>
                <Link to="/inventory" className="link-btn">Open Catalog →</Link>
              </div>

              <div className="priority-list">
                {metrics.priorityItems.length === 0 ? (
                  <div className="empty-state">
                    <p>All hardware components are adequately stocked.</p>
                  </div>
                ) : (
                  metrics.priorityItems.map((item) => {
                    const st = getStockStatus(item);
                    return (
                      <div className="priority-item" key={item.id}>
                        <div className="priority-info">
                          <strong>{item.name}</strong>
                          <div className="muted-text">
                            <span className="sku-code">{item.sku}</span> • Min: {item.minQty}
                            {item.location ? ` • ${item.location}` : ''}
                          </div>
                        </div>
                        <div className="priority-actions">
                          <span className={`badge ${st.badge}`}>{item.qty} left</span>
                          <button type="button" className="btn btn-sm btn-secondary" onClick={() => adjustStock(item.id, 5)}>
                            +5
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Add Component Modal */}
      {modalOpen && (
        <div className="modal-backdrop open" onClick={() => setModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Hardware Component</h2>
              <button type="button" className="icon-btn" onClick={() => setModalOpen(false)} aria-label="Close modal">
                ✕
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Component Name *</label>
                  <input type="text" required placeholder="e.g., Intel Core i7-14700K" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Part SKU *</label>
                  <input type="text" required placeholder="e.g., CPU-14700K" value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <input type="text" list="hwCategories" required placeholder="Processors (CPU)" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
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
                  <input type="text" required placeholder="e.g., ASUS ROG Supply" value={formData.supplier} onChange={(e) => setFormData({ ...formData, supplier: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Unit Price ($) *</label>
                  <input type="number" step="0.01" min="0" required placeholder="399.99" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Quantity in Stock *</label>
                  <input type="number" min="0" required placeholder="12" value={formData.qty} onChange={(e) => setFormData({ ...formData, qty: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Reorder Threshold *</label>
                  <input type="number" min="0" required placeholder="5" value={formData.minQty} onChange={(e) => setFormData({ ...formData, minQty: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>ESD Bin / Rack Location</label>
                  <input type="text" placeholder="e.g., Bin A-05" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
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

      <div className={`toast ${toastMsg ? 'show' : ''}`} role="status" aria-live="polite">
        {toastMsg}
      </div>
    </div>
  );
}

export default Home;