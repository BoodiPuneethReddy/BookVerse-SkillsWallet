import React, { useState, useEffect } from 'react';
import Snavbar from './Snavbar';
import API from '../api/axios';
import { getBookCover } from '../api/bookCovers';
import toast from 'react-hot-toast';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingKey, setUpdatingKey] = useState(null);
  const [selectedStatuses, setSelectedStatuses] = useState({});
  const [estimatedDeliveries, setEstimatedDeliveries] = useState({});

  const fetchOrders = async () => {
    try {
      const res = await API.get('/seller/my-orders');
      if (res.data.success) {
        setOrders(res.data.data);
        const statuses = {};
        const estimates = {};
        res.data.data.forEach((order) => {
          order.items.forEach((item) => {
            const bookId = item.book?._id || item.book;
            const key = `${order._id}-${bookId}`;
            statuses[key] = item.status;
            estimates[key] = item.estimatedDelivery ? new Date(item.estimatedDelivery).toLocaleDateString('en-GB') : '';
          });
        });
        setSelectedStatuses(statuses);
        setEstimatedDeliveries(estimates);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = (key, newStatus) => {
    setSelectedStatuses(prev => ({ ...prev, [key]: newStatus }));
  };

  const handleEstimateChange = (key, value) => {
    setEstimatedDeliveries(prev => ({ ...prev, [key]: value }));
  };

  const handleUpdateStatus = async (orderId, bookId) => {
    const key = `${orderId}-${bookId}`;
    const status = selectedStatuses[key];
    const estDelivery = estimatedDeliveries[key];

    setUpdatingKey(key);
    try {
      const res = await API.put(`/seller/update-order/${orderId}`, {
        orderStatus: status,
        bookId: bookId,
        estimatedDelivery: estDelivery
      });
      if (res.data.success) {
        toast.success('Order item status updated successfully');
        fetchOrders();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingKey(null);
    }
  };

  return (
    <div className="dashboard-layout font-poppins">
      <Snavbar />
      <main className="dashboard-content">
        <header className="dashboard-header">
          <h1>Orders Received</h1>
        </header>

        {loading ? (
          <div className="spinner-container"><div className="spinner"></div></div>
        ) : (
          <div className="table-responsive">
            <table className="data-table orders-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Order ID</th>
                  <th>Customer Name</th>
                  <th>Address</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Est. Delivery Date</th>
                  <th>Status</th>
                  <th>Operation</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.flatMap((order) => {
                    const bookingDate = new Date(order.createdAt).toLocaleDateString('en-GB', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    });

                    return order.items.map((item, idx) => {
                      const bookId = item.book?._id || item.book;
                      const key = `${order._id}-${bookId}`;
                      
                      return (
                        <tr key={`${order._id}-${idx}`}>
                          <td className="product-td">
                            <div className="product-cell-wrapper">
                              <div className="table-img-wrapper">
                                <img src={getBookCover(item.book)} alt={item.book?.title || 'Book Cover'} />
                              </div>
                              <span className="product-title-span">{item.book?.title || 'Unknown Book'}</span>
                            </div>
                          </td>
                          <td className="text-sm code-font">#{order._id.substring(order._id.length - 8).toUpperCase()}</td>
                          <td>{order.user?.fullName || 'Guest Customer'}</td>
                          <td className="address-td" title={order.shippingAddress}>
                            {order.shippingAddress}
                          </td>
                          <td>{item.quantity}</td>
                          <td className="price-td">₹{(item.price * item.quantity).toFixed(2)}</td>
                          <td>
                            <input 
                              type="text" 
                              value={estimatedDeliveries[key] || ''}
                              onChange={(e) => handleEstimateChange(key, e.target.value)}
                              placeholder="e.g. 24/07/2026"
                              style={{
                                padding: '6px 12px',
                                border: '1px solid #cbd5e1',
                                borderRadius: '6px',
                                fontSize: '12px',
                                width: '120px',
                                outline: 'none'
                              }}
                              disabled={item.status === 'Delivered'}
                            />
                          </td>
                          <td>
                            <select
                              className={`status-select select-${(selectedStatuses[key] || item.status)?.toLowerCase().replace(/\s+/g, '')}`}
                              value={selectedStatuses[key] || item.status}
                              onChange={(e) => handleStatusChange(key, e.target.value)}
                              disabled={item.status === 'Delivered'}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Packed">Packed</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Out For Delivery">Out For Delivery</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => handleUpdateStatus(order._id, bookId)}
                              disabled={updatingKey === key || item.status === 'Delivered'}
                            >
                              {updatingKey === key ? 'Updating...' : item.status === 'Delivered' ? 'Locked' : 'Update'}
                            </button>
                          </td>
                        </tr>
                      );
                    });
                  })
                ) : (
                  <tr>
                    <td colSpan="9" className="no-data">No orders received yet for your products.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default Orders;
