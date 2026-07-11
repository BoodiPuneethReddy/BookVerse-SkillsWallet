import Admin from '../models/Admin.js';
import User from '../models/User.js';
import Seller from '../models/Seller.js';
import Book from '../models/Book.js';
import MyOrder from '../models/MyOrder.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new admin
// @route   POST /api/admin/signup
// @access  Public
export const signup = async (req, res) => {
  try {
    const { fullName, email, password, phone, profileImage } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide fullName, email and password',
      });
    }

    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(409).json({
        success: false,
        message: 'Admin with this email already exists',
      });
    }

    const admin = await Admin.create({
      fullName,
      email,
      password,
      phone,
      profileImage,
    });

    if (admin) {
      const token = generateToken(admin._id, 'admin');
      return res.status(201).json({
        success: true,
        message: 'Admin registered successfully',
        token,
        data: {
          _id: admin._id,
          fullName: admin.fullName,
          email: admin.email,
          phone: admin.phone,
          profileImage: admin.profileImage,
          isSuperAdmin: admin.isSuperAdmin,
        },
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid admin data',
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during admin signup',
    });
  }
};

// @desc    Auth admin & get token
// @route   POST /api/admin/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const admin = await Admin.findOne({ email });

    if (admin && (await admin.matchPassword(password))) {
      const token = generateToken(admin._id, 'admin');
      return res.status(200).json({
        success: true,
        message: 'Admin logged in successfully',
        token,
        data: {
          _id: admin._id,
          fullName: admin.fullName,
          email: admin.email,
          phone: admin.phone,
          profileImage: admin.profileImage,
          isSuperAdmin: admin.isSuperAdmin,
        },
      });
    } else {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during admin login',
    });
  }
};

// @desc    Get admin profile
// @route   GET /api/admin/profile
// @access  Private (Admin only)
export const profile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user._id).select('-password');
    if (admin) {
      return res.status(200).json({
        success: true,
        message: 'Admin profile fetched successfully',
        data: admin,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'Admin profile not found',
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching admin profile',
    });
  }
};

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin only)
export const dashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSellers = await Seller.countDocuments();
    const totalBooks = await Book.countDocuments();
    const totalOrders = await MyOrder.countDocuments();

    return res.status(200).json({
      success: true,
      message: 'Admin dashboard stats fetched successfully',
      data: {
        totalUsers,
        totalSellers,
        totalBooks,
        totalOrders,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching admin dashboard stats',
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin only)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    return res.status(200).json({
      success: true,
      message: 'All users fetched successfully',
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching users',
    });
  }
};

// @desc    Get all sellers
// @route   GET /api/admin/sellers
// @access  Private (Admin only)
export const getSellers = async (req, res) => {
  try {
    const sellers = await Seller.find().select('-password');
    return res.status(200).json({
      success: true,
      message: 'All sellers fetched successfully',
      data: sellers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching sellers',
    });
  }
};

// @desc    Get all books
// @route   GET /api/admin/books
// @access  Private (Admin only)
export const getBooks = async (req, res) => {
  try {
    const books = await Book.find().populate('seller', 'fullName shopName email');
    return res.status(200).json({
      success: true,
      message: 'All books fetched successfully',
      data: books,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching books',
    });
  }
};

// @desc    Delete a book
// @route   DELETE /api/admin/book/:id
// @access  Private (Admin only)
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    await Seller.findByIdAndUpdate(book.seller, {
      $pull: { books: book._id },
    });

    await Book.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Book deleted successfully by Admin',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error deleting book',
    });
  }
};

// @desc    Toggle block/unblock a user
// @route   PUT /api/admin/user/:id
// @access  Private (Admin only)
export const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`,
      data: {
        _id: user._id,
        fullName: user.fullName,
        isBlocked: user.isBlocked,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error toggling user status',
    });
  }
};

// @desc    Approve or reject a seller
// @route   PUT /api/admin/seller/:id
// @access  Private (Admin only)
export const approveSeller = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found',
      });
    }

    seller.isApproved = !seller.isApproved;
    await seller.save();

    return res.status(200).json({
      success: true,
      message: `Seller approval status set to ${seller.isApproved ? 'Approved' : 'Unapproved'}`,
      data: {
        _id: seller._id,
        fullName: seller.fullName,
        isApproved: seller.isApproved,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error toggling seller approval status',
    });
  }
};

// @desc    Get user specific orders
// @route   GET /api/admin/orders/user/:userId
// @access  Private (Admin only)
export const getUserOrders = async (req, res) => {
  try {
    const orders = await MyOrder.find({ user: req.params.userId }).populate('items.book');
    return res.status(200).json({
      success: true,
      message: 'User orders fetched successfully',
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching user orders',
    });
  }
};
