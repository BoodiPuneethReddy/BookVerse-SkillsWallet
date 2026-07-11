import React from 'react';
import { getBookCover } from '../api/bookCovers';

const OrderItem = ({ order, onTrackClick }) => {
  // Dates
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

  return (
    <>
      {order.items.map((item, index) => (
        <tr key={`${order._id}-${index}`}>
          <td>
            <div className="product-cell-wrapper">
              <div className="table-img-wrapper">
                <img src={getBookCover(item.book)} alt={item.book?.title || 'Book Cover'} />
              </div>
              <span className="product-title-span">{item.book?.title || 'Atomic Habits'}</span>
            </div>
          </td>
          <td className="code-font text-xs">{order._id}</td>
          <td className="address-td" title={order.shippingAddress}>
            {order.shippingAddress}
          </td>
          <td>{item.book?.seller?.shopName || 'Prananshu'}</td>
          <td>{bookingDate}</td>
          <td>{deliveryDate}</td>
          <td className="price-td">₹{(item.price * item.quantity).toFixed(2)}</td>
          <td>
            <span 
              className={`status-badge status-${order.orderStatus.toLowerCase()}`}
              onClick={() => onTrackClick(order)}
              style={{ cursor: 'pointer' }}
              title="Click to track order timeline"
            >
              {order.orderStatus}
            </span>
          </td>
        </tr>
      ))}
    </>
  );
};

export default OrderItem;
