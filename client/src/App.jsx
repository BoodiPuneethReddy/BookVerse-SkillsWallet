import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// General Landing Home Page
import Home from './Components/Home';

// User Portal Pages
import Login from './User/Login';
import Signup from './User/Signup';
import Uhome from './User/Uhome';
import Products from './User/Products';
import Uitem from './User/Uitem';
import MyOrders from './User/MyOrders';

// Seller Portal Pages
import Slogin from './Seller/Slogin';
import Ssignup from './Seller/Ssignup';
import Shome from './Seller/Shome';
import Addbook from './Seller/Addbook';
import Book from './Seller/Book';
import MyProducts from './Seller/MyProducts';
import Orders from './Seller/Orders';

// Admin Portal Pages
import Alogin from './Admin/Alogin';
import Asignup from './Admin/Asignup';
import Ahome from './Admin/Ahome';
import Users from './Admin/Users';
import Seller from './Admin/Seller';
import Items from './Admin/Items';

function App() {
  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        {/* Landing Portal */}
        <Route path="/" element={<Home />} />

        {/* User Routes */}
        <Route path="/user/signup" element={<Signup />} />
        <Route path="/user/login" element={<Login />} />
        <Route path="/user/home" element={<Uhome />} />
        <Route path="/user/books" element={<Products />} />
        <Route path="/user/book/:id" element={<Uitem />} />
        <Route path="/user/orders" element={<MyOrders />} />

        {/* Seller Routes */}
        <Route path="/seller/signup" element={<Ssignup />} />
        <Route path="/seller/login" element={<Slogin />} />
        <Route path="/seller/home" element={<Shome />} />
        <Route path="/seller/add-book" element={<Addbook />} />
        <Route path="/seller/book/:id" element={<Book />} />
        <Route path="/seller/products" element={<MyProducts />} />
        <Route path="/seller/orders" element={<Orders />} />

        {/* Admin Routes */}
        <Route path="/admin/signup" element={<Asignup />} />
        <Route path="/admin/login" element={<Alogin />} />
        <Route path="/admin/home" element={<Ahome />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/sellers" element={<Seller />} />
        <Route path="/admin/items" element={<Items />} />
      </Routes>
    </Router>
  );
}

export default App;
