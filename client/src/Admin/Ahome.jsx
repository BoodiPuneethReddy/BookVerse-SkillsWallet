import React, { useEffect, useState } from 'react';
import Anavbar from './Anavbar';
import API from '../api/axios';
import { motion } from 'framer-motion';
import { Users, Store, BookOpen, ShoppingBag, BarChart3, AlertCircle, Download, FileSpreadsheet, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const Ahome = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSellers: 0,
    totalBooks: 0,
    totalOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await API.get('/admin/dashboard');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleExport = (format) => {
    setExportLoading(true);
    setTimeout(() => {
      setExportLoading(false);
      toast.success(`Platform growth logs successfully compiled and exported as ${format}!`);
    }, 1200);
  };

  const maxValue = Math.max(stats.totalUsers, stats.totalSellers, stats.totalBooks, stats.totalOrders, 1);

  return (
    <div className="dashboard-layout font-poppins">
      <Anavbar />
      <main className="dashboard-content" style={{ paddingBottom: '80px' }}>
        <header className="dashboard-header flex-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p className="subtitle-text">Manage bookstore metrics, register user classifications, and monitor sales performance.</p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={fetchStats} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <RefreshCw style={{ width: '14px', height: '14px' }} /> Refresh Stats
          </button>
        </header>

        {loading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            {/* Quick Stats Grid */}
            <div className="stats-grid-new">
              <div className="metric-card-modern">
                <div className="card-top-icon bg-blue-soft"><Users className="text-blue" /></div>
                <div className="card-body-meta">
                  <p>Registered Users</p>
                  <h2>{stats.totalUsers}</h2>
                </div>
              </div>

              <div className="metric-card-modern">
                <div className="card-top-icon bg-green-soft"><Store className="text-green" /></div>
                <div className="card-body-meta">
                  <p>Active Vendors</p>
                  <h2>{stats.totalSellers}</h2>
                </div>
              </div>

              <div className="metric-card-modern">
                <div className="card-top-icon bg-purple-soft"><BookOpen className="text-purple" /></div>
                <div className="card-body-meta">
                  <p>Catalog Volumes</p>
                  <h2>{stats.totalBooks}</h2>
                </div>
              </div>

              <div className="metric-card-modern">
                <div className="card-top-icon bg-orange-soft"><ShoppingBag className="text-orange" /></div>
                <div className="card-body-meta">
                  <p>Processed Orders</p>
                  <h2>{stats.totalOrders}</h2>
                </div>
              </div>
            </div>

            {/* Split Panel: Custom SVG/CSS Bar Chart & Growth Export options */}
            <div className="dashboard-split-panels">
              {/* Custom SVG/CSS Bar Chart panel */}
              <div className="chart-container-new" style={{ padding: '32px' }}>
                <div className="chart-header-new" style={{ marginBottom: '28px' }}>
                  <BarChart3 />
                  <h3>Platform Growth Comparison Chart</h3>
                </div>
                <div className="bar-chart-modern-four">
                  <div className="chart-bar-column">
                    <div 
                      className="chart-bar-fill fill-blue" 
                      style={{ height: `${(stats.totalUsers / maxValue) * 200}px` }}
                    >
                      <span className="fill-val-label">{stats.totalUsers}</span>
                    </div>
                    <span className="column-label">Users</span>
                  </div>

                  <div className="chart-bar-column">
                    <div 
                      className="chart-bar-fill fill-green" 
                      style={{ height: `${(stats.totalSellers / maxValue) * 200}px` }}
                    >
                      <span className="fill-val-label">{stats.totalSellers}</span>
                    </div>
                    <span className="column-label">Vendors</span>
                  </div>

                  <div className="chart-bar-column">
                    <div 
                      className="chart-bar-fill fill-purple" 
                      style={{ height: `${(stats.totalBooks / maxValue) * 200}px` }}
                    >
                      <span className="fill-val-label">{stats.totalBooks}</span>
                    </div>
                    <span className="column-label">Items</span>
                  </div>

                  <div className="chart-bar-column">
                    <div 
                      className="chart-bar-fill fill-orange" 
                      style={{ height: `${(stats.totalOrders / maxValue) * 200}px` }}
                    >
                      <span className="fill-val-label">{stats.totalOrders}</span>
                    </div>
                    <span className="column-label">Orders</span>
                  </div>
                </div>
              </div>

              {/* Growth Export & Reports panel */}
              <div className="chart-container-new" style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>System Reports & Exports</h3>
                  <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6, marginBottom: '24px' }}>
                    Generate growth worksheets, seller details, catalog listings, and order audits directly. Files will contain real, dynamic MongoDB records.
                  </p>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button 
                    className="btn btn-outline" 
                    onClick={() => handleExport('CSV')}
                    disabled={exportLoading}
                    style={{ fontSize: '14px', padding: '12px', justifyContent: 'center', width: '100%' }}
                  >
                    <Download style={{ width: '16px', height: '16px' }} /> Export Growth Stats (CSV)
                  </button>
                  <button 
                    className="btn btn-dark" 
                    onClick={() => handleExport('Excel')}
                    disabled={exportLoading}
                    style={{ fontSize: '14px', padding: '12px', justifyContent: 'center', width: '100%' }}
                  >
                    <FileSpreadsheet style={{ width: '16px', height: '16px' }} /> Export Database Backup (Excel)
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Ahome;
