import React, { useEffect, useState } from 'react';
import Snavbar from './Snavbar';
import API from '../api/axios';
import { motion } from 'framer-motion';
import { 
  Package, 
  ShoppingBag, 
  Boxes, 
  IndianRupee, 
  TrendingUp, 
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Clock,
  User,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getBookCover } from '../api/bookCovers';

const Shome = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalStock: 0,
    totalOrders: 0,
    books: []
  });
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/seller/dashboard');
        if (res.data.success) {
          setStats({
            totalBooks: res.data.data.totalBooks,
            totalStock: res.data.data.totalStock,
            totalOrders: res.data.data.totalOrders,
            books: res.data.data.books || []
          });
        }

        // Fetch seller's orders list for recent feed
        const ordersRes = await API.get('/seller/my-orders');
        if (ordersRes.data.success) {
          setRecentOrders(ordersRes.data.data.slice(0, 3));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const maxValue = Math.max(stats.totalBooks, stats.totalOrders, 1);

  // Calculate mock revenue: assuming average price of books is ₹399
  const estimatedRevenue = stats.totalOrders * 399.0;

  // Find books that have low stock (< 5)
  const lowStockBooks = stats.books.filter((b) => b.stock < 5);

  return (
    <div className="dashboard-layout font-poppins">
      <Snavbar />
      <main className="dashboard-content" style={{ paddingBottom: '80px' }}>
        <header className="dashboard-header flex-header">
          <div>
            <h1>Shop Overview</h1>
            <p className="subtitle-text">Monitor your inventory sales, stock health, and revenue generation.</p>
          </div>
          <Link to="/seller/add-book" className="btn btn-primary">Add Book</Link>
        </header>

        {loading ? (
          <div className="spinner-container"><div className="spinner"></div></div>
        ) : (
          <>
            {/* SaaS Metrics Cards */}
            <div className="stats-grid-new">
              <div className="metric-card-modern">
                <div className="card-top-icon bg-blue-soft"><Package className="text-blue" /></div>
                <div className="card-body-meta">
                  <p>Total Products</p>
                  <h2>{stats.totalBooks}</h2>
                </div>
              </div>

              <div className="metric-card-modern">
                <div className="card-top-icon bg-green-soft"><IndianRupee className="text-green" /></div>
                <div className="card-body-meta">
                  <p>Estimated Revenue</p>
                  <h2>₹{estimatedRevenue.toFixed(2)}</h2>
                </div>
              </div>

              <div className="metric-card-modern">
                <div className="card-top-icon bg-orange-soft"><ShoppingBag className="text-orange" /></div>
                <div className="card-body-meta">
                  <p>Orders Received</p>
                  <h2>{stats.totalOrders}</h2>
                </div>
              </div>

              <div className="metric-card-modern">
                <div className="card-top-icon bg-purple-soft"><Boxes className="text-purple" /></div>
                <div className="card-body-meta">
                  <p>Total Inventory Stock</p>
                  <h2>{stats.totalStock}</h2>
                </div>
              </div>
            </div>

            {/* Split Grid for Chart & Inventory Health */}
            <div className="dashboard-split-panels" style={{ marginBottom: '32px' }}>
              {/* Left Panel: Comparison Chart */}
              <div className="chart-panel-card">
                <h3>Sales Performance Chart</h3>
                <div className="bar-chart-modern">
                  <div className="chart-bar-column">
                    <div 
                      className="chart-bar-fill fill-blue" 
                      style={{ height: `${(stats.totalBooks / maxValue) * 200}px` }}
                    >
                      <span className="fill-val-label">{stats.totalBooks}</span>
                    </div>
                    <span className="column-label">Items Listed</span>
                  </div>

                  <div className="chart-bar-column">
                    <div 
                      className="chart-bar-fill fill-orange" 
                      style={{ height: `${(stats.totalOrders / maxValue) * 200}px` }}
                    >
                      <span className="fill-val-label">{stats.totalOrders}</span>
                    </div>
                    <span className="column-label">Total Sales</span>
                  </div>
                </div>
              </div>

              {/* Right Panel: Inventory Health alerts */}
              <div className="alerts-panel-card">
                <h3>Inventory Health</h3>
                <div className="alert-items-list" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                  {lowStockBooks.length > 0 ? (
                    lowStockBooks.map((b) => (
                      <div key={b._id} className="alert-card-warning" style={{ marginBottom: '12px' }}>
                        <AlertTriangle className="alert-icon-warning" />
                        <div>
                          <h4>Low Stock Alert</h4>
                          <p><strong>{b.title}</strong> is running low on stock. Only {b.stock} left in inventory.</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="alert-card-healthy">
                      <CheckCircle2 className="alert-icon-healthy" />
                      <div>
                        <h4>Inventory Healthy</h4>
                        <p>All items listed in your catalog have sufficient stock levels.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Panels: Recent Orders and Top Products */}
            <div className="dashboard-split-panels">
              {/* Recent Orders Received panel */}
              <div className="chart-panel-card" style={{ padding: '24px' }}>
                <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>Recent Orders Received</h3>
                {recentOrders.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {recentOrders.map((order) => (
                      <div 
                        key={order._id}
                        onClick={() => navigate('/seller/orders')}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '12px 16px',
                          border: '1px solid var(--border-color)',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          backgroundColor: '#f8fafc'
                        }}
                        className="suggestion-item-hover"
                      >
                        <div>
                          <h4 style={{ fontSize: '13px', fontWeight: 700 }}>
                            {order.items?.[0]?.book?.title || 'Atomic Habits'}
                          </h4>
                          <p style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                            Customer: {order.user?.fullName || 'Guest'}
                          </p>
                        </div>
                        <span className={`status-badge status-${order.orderStatus.toLowerCase()}`} style={{ fontSize: '10px', padding: '2px 8px' }}>
                          {order.orderStatus}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#64748b', fontSize: '13px' }}>No orders received yet.</p>
                )}
              </div>

              {/* Top Listed Books panel */}
              <div className="chart-panel-card" style={{ padding: '24px' }}>
                <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>Top Inventory Items</h3>
                {stats.books.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {stats.books.slice(0, 3).map((book) => (
                      <div 
                        key={book._id}
                        onClick={() => navigate('/seller/products')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '8px 16px',
                          border: '1px solid var(--border-color)',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          backgroundColor: '#f8fafc'
                        }}
                        className="suggestion-item-hover"
                      >
                        <img 
                          src={getBookCover(book)} 
                          alt={book.title} 
                          style={{ width: '32px', height: '42px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: '13px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>{book.title}</h4>
                          <p style={{ fontSize: '11px', color: '#64748b' }}>Stock: {book.stock} • ₹{book.price.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#64748b', fontSize: '13px' }}>No books listed in shop catalog.</p>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Shome;
