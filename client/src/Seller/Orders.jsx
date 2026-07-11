import React, { useState, useEffect } from 'react';
import Snavbar from './Snavbar';
import API from '../api/axios';
import { getBookCover } from '../api/bookCovers';
import toast from 'react-hot-toast';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedStatuses, setSelectedStatuses] = useState({});

  const fetchOrders = async () => {
    try {
      const res = await API.get('/seller/my-orders');
      if (res.data.success) {
        setOrders(res.data.data);
        const statuses = {};
        res.data.data.forEach((order) => {
          statuses[order._id] = order.orderStatus;
        });
        setSelectedStatuses(statuses);
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

  const handleStatusChange = (orderId, newStatus) => {
    setSelectedStatuses({ ...selectedStatuses, [orderId]: newStatus });
  };

  const handleUpdateStatus = async (orderId) => {
    const status = selectedStatuses[orderId];
    setUpdatingId(orderId);
    try {
      const res = await API.put(`/seller/update-order/${orderId}`, { orderStatus: status });
      if (res.data.success) {
        toast.success(res.data.message || 'Order status updated successfully');
        fetchOrders();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
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
                  <th>Booking Date</th>
                  <th>Delivery By</th>
                  <th>Warranty</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Operation</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order) => {
                    const bookingDate = new Date(order.createdAt).toLocaleDateString('en-GB', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    });

                    const d = new Date(order.createdAt);
                    d.setDate(d.getDate() + 5);
                    const deliveryDate = d.toLocaleDateString('en-GB', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    });

                    return order.items.map((item, idx) => (
                      <tr key={`${order._id}-${idx}`}>
                        <td className="product-td">
                          <div className="product-cell-wrapper">
                            <div className="table-img-wrapper">
                              <img src={getBookCover(item.book)} alt={item.book?.title || 'Book Cover'} />
                            </div>
                            <span className="product-title-span">{item.book?.title || 'Unknown Book'}</span>
                          </div>
                        </td>
                        <td className="text-sm code-font">{order._id}</td>
                        <td>{order.user?.fullName || 'Guest Customer'}</td>
                        <td className="address-td" title={order.shippingAddress}>
                          {order.shippingAddress}
                        </td>
                        <td>{bookingDate}</td>
                        <td>{deliveryDate}</td>
                        <td>1 year</td>
                        <td className="price-td">₹{(item.price * item.quantity).toFixed(2)}</td>
                        <td>
                          <select
                            className={`status-select select-${selectedStatuses[order._id]?.toLowerCase()}`}
                            value={selectedStatuses[order._id] || order.orderStatus}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Packed">Packed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleUpdateStatus(order._id)}
                            disabled={updatingId === order._id}
                          >
                            {updatingId === order._id ? 'Updating...' : 'Update'}
                          </button>
                        </td>
                      </tr>
                    ));
                  })
                ) : (
                  <tr>
                    <td colSpan="10" className="no-data">No orders received yet for your products.</td>
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
