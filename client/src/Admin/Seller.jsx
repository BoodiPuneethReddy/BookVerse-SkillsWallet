import React, { useState, useEffect } from 'react';
import Anavbar from './Anavbar';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { FaCheck, FaTimes } from 'react-icons/fa';

const Seller = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSellers = async () => {
    try {
      const res = await API.get('/admin/sellers');
      if (res.data.success) {
        setSellers(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const handleToggleApprove = async (sellerId) => {
    try {
      const res = await API.put(`/admin/seller/${sellerId}`);
      if (res.data.success) {
        toast.success(res.data.message);
        fetchSellers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="dashboard-layout">
      <Anavbar />
      <main className="dashboard-content">
        <header className="dashboard-header">
          <h1>Manage Sellers</h1>
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
                  <th>Seller</th>
                  <th>Shop Name</th>
                  <th>Email</th>
                  <th>Approval Status</th>
                  <th>Operation</th>
                </tr>
              </thead>
              <tbody>
                {sellers.length > 0 ? (
                  sellers.map((seller, index) => (
                    <tr key={seller._id}>
                      <td>{index + 1}</td>
                      <td>{seller.fullName}</td>
                      <td>{seller.shopName}</td>
                      <td>{seller.email}</td>
                      <td>
                        <span className={`badge ${seller.isApproved ? 'badge-success' : 'badge-danger'}`}>
                          {seller.isApproved ? 'Approved' : 'Pending Approval'}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <button
                          className={`btn btn-sm ${seller.isApproved ? 'btn-danger' : 'btn-success'}`}
                          onClick={() => handleToggleApprove(seller._id)}
                        >
                          {seller.isApproved ? <FaTimes /> : <FaCheck />} {seller.isApproved ? 'Reject' : 'Approve'}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data">No sellers registered in the bookstore.</td>
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

export default Seller;
