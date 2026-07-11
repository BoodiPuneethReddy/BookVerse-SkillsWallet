import React, { useState, useEffect } from 'react';
import Anavbar from './Anavbar';
import API from '../api/axios';
import { getBookCover } from '../api/bookCovers';
import toast from 'react-hot-toast';
import { FaBan, FaCheck, FaEye, FaTimes } from 'react-icons/fa';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserOrders, setSelectedUserOrders] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await API.get('/admin/users');
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleBlock = async (userId) => {
    try {
      const res = await API.put(`/admin/user/${userId}`);
      if (res.data.success) {
        toast.success(res.data.message);
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="dashboard-layout font-poppins">
      <Anavbar />
      <main className="dashboard-content">
        <header className="dashboard-header">
          <h1>Manage Users</h1>
        </header>

        {loading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Sl.No</th>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Operation</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user, index) => (
                    <tr key={user._id}>
                      <td>{index + 1}</td>
                      <td>{user._id}</td>
                      <td>{user.fullName}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`badge ${user.isBlocked ? 'badge-danger' : 'badge-success'}`}>
                          {user.isBlocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <button
                          className={`btn btn-sm ${user.isBlocked ? 'btn-success' : 'btn-danger'}`}
                          onClick={() => handleToggleBlock(user._id)}
                          title={user.isBlocked ? 'Unblock User' : 'Block User'}
                        >
                          {user.isBlocked ? <FaCheck /> : <FaBan />} {user.isBlocked ? 'Unblock' : 'Block'}
                        </button>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={async () => {
                            setSelectedUser(user);
                            setShowModal(true);
                            setModalLoading(true);
                            try {
                              const res = await API.get(`/admin/orders/user/${user._id}`);
                              if (res.data.success) {
                                setSelectedUserOrders(res.data.data);
                              }
                            } catch (err) {
                              setSelectedUserOrders([]);
                            } finally {
                              setModalLoading(false);
                            }
                          }}
                        >
                          <FaEye /> View Orders
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data">No users registered in the bookstore.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal for User's Orders matching PDF Page 2 */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content orders-modal">
              <div className="modal-header">
                <h2>User Orders ({selectedUser?.fullName})</h2>
                <button className="close-btn-x" onClick={() => setShowModal(false)}><FaTimes /></button>
              </div>
              <div className="modal-body">
                {modalLoading ? (
                  <div className="spinner-container"><div className="spinner"></div></div>
                ) : selectedUserOrders.length > 0 ? (
                  <div className="orders-list-modal">
                    {selectedUserOrders.map((order) => (
                      <div key={order._id} className="order-modal-card">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="order-modal-item">
                            <div className="item-img">
                              <img src={getBookCover(item.book)} alt={item.book?.title || 'Book Cover'} />
                            </div>
                            <div className="item-info">
                              <h4>{item.book?.title || 'Atomic Habits'}</h4>
                              <p className="order-meta">Order ID: <span>{order._id}</span></p>
                              <p className="order-meta">Buyer: <span>{selectedUser?.fullName}</span></p>
                              <p className="order-meta">Address: <span>{order.shippingAddress}</span></p>
                              <p className="order-meta">Price: <span className="price-tag">₹{item.price * item.quantity}</span></p>
                              <p className="order-meta">Status: <span className={`status-badge status-${order.orderStatus.toLowerCase()}`}>{order.orderStatus}</span></p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-orders-msg">No orders placed by this user yet.</p>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-dark" onClick={() => setShowModal(false)}>Close</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Users;
