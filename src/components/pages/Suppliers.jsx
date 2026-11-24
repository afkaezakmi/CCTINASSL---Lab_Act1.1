import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Suppliers.css';

const STATIC_SUPPLIERS = [
  { name: 'AMD Official Dist.', specialty: 'Processors (CPU)', skus: 3, units: 28, value: 10892.00 },
  { name: 'ASUS ROG Supply', specialty: 'Graphics Cards & Motherboards', skus: 5, units: 19, value: 11399.81 },
  { name: 'Corsair Components', specialty: 'DDR5 RAM, Cases & PSUs', skus: 6, units: 44, value: 5038.00 },
  { name: 'Samsung Tech Dist.', specialty: 'NVMe & SATA Storage', skus: 4, units: 31, value: 5239.00 },
  { name: 'MSI Distribution', specialty: 'Motherboards & GPUs', skus: 4, units: 17, value: 3383.00 },
  { name: 'Seasonic Direct', specialty: 'Modular Power Supplies', skus: 2, units: 9, value: 1259.91 }
];

function Suppliers() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
            <span className="nav-badge">3</span>
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
              <h1 className="page-title">Hardware Distributors</h1>
              <p className="page-subtitle">Authorized PC component vendors, active SKUs, and stock valuation</p>
            </div>
          </div>
        </header>

        <section className="view-section active">
          <div className="suppliers-grid">
            {STATIC_SUPPLIERS.map((sup) => (
              <div className="card supplier-card" key={sup.name}>
                <h3>{sup.name}</h3>
                <p className="muted-text" style={{ marginTop: '-0.65rem', marginBottom: '0.9rem' }}>
                  {sup.specialty}
                </p>
                <div className="supplier-stats">
                  <div><span className="muted-text">SKUs</span><strong>{sup.skus}</strong></div>
                  <div><span className="muted-text">Units</span><strong>{sup.units}</strong></div>
                  <div><span className="muted-text">Value</span><strong>${sup.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Suppliers;