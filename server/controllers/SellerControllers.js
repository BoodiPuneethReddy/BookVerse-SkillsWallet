import Seller from '../models/Seller.js';
import Book from '../models/Book.js';
import MyOrder from '../models/MyOrder.js';
import generateToken from '../utils/generateToken.js';
import fs from 'fs';

// @desc    Register a new seller
// @route   POST /api/seller/signup
// @access  Public
export const signup = async (req, res) => {
  try {
    const { fullName, email, password, phone, address, shopName, profileImage } = req.body;

    if (!fullName || !email || !password || !shopName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide fullName, email, password, and shopName',
      });
    }

    const sellerExists = await Seller.findOne({ email });
    if (sellerExists) {
      return res.status(409).json({
        success: false,
        message: 'Seller with this email already exists',
      });
    }

    const seller = await Seller.create({
      fullName,
      email,
      password,
      phone,
      address,
      shopName,
      profileImage,
      isApproved: true, // Default true as per specifications
    });

    if (seller) {
      const token = generateToken(seller._id, 'seller');
      return res.status(201).json({
        success: true,
        message: 'Seller registered successfully',
        token,
        data: {
          _id: seller._id,
          fullName: seller.fullName,
          email: seller.email,
          phone: seller.phone,
          address: seller.address,
          shopName: seller.shopName,
          profileImage: seller.profileImage,
          isApproved: seller.isApproved,
        },
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid seller data',
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during seller signup',
    });
  }
};

// @desc    Auth seller & get token
// @route   POST /api/seller/login
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

    const seller = await Seller.findOne({ email });

    if (!seller) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check approval status
    if (!seller.isApproved) {
      return res.status(403).json({
        success: false,
        message: 'Your seller account has not been approved yet by Admin',
      });
    }

    if (await seller.matchPassword(password)) {
      const token = generateToken(seller._id, 'seller');
      return res.status(200).json({
        success: true,
        message: 'Seller logged in successfully',
        token,
        data: {
          _id: seller._id,
          fullName: seller.fullName,
          email: seller.email,
          phone: seller.phone,
          address: seller.address,
          shopName: seller.shopName,
          profileImage: seller.profileImage,
          isApproved: seller.isApproved,
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
      message: error.message || 'Server error during seller login',
    });
  }
};

// @desc    Get seller profile
// @route   GET /api/seller/profile
// @access  Private (Seller only)
export const profile = async (req, res) => {
  try {
    const seller = await Seller.findById(req.user._id).select('-password');
    if (seller) {
      return res.status(200).json({
        success: true,
        message: 'Seller profile fetched successfully',
        data: seller,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'Seller profile not found',
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching seller profile',
    });
  }
};

// @desc    Get seller dashboard statistics
// @route   GET /api/seller/dashboard
// @access  Private (Seller only)
export const dashboard = async (req, res) => {
  try {
    const books = await Book.find({ seller: req.user._id });
    const totalBooks = books.length;
    const totalStock = books.reduce((acc, curr) => acc + curr.stock, 0);

    // Count orders containing this seller's books
    const bookIds = books.map((b) => b._id);
    const orders = await MyOrder.find({ 'items.book': { $in: bookIds } });
    const totalOrders = orders.length;

    return res.status(200).json({
      success: true,
      message: 'Seller dashboard stats fetched successfully',
      data: {
        totalBooks,
        totalStock,
        totalOrders,
        books,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching seller dashboard stats',
    });
  }
};

// @desc    Add a book
// @route   POST /api/seller/add-book
// @access  Private (Seller only)
export const addBook = async (req, res) => {
  try {
    const { title, author, description, category, price, stock } = req.body;

    if (!title || !author || !description || !category || !price || !stock) {
      // Clean up uploaded image if request validation fails
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: 'Please provide title, author, description, category, price, and stock',
      });
    }

    if (Number(price) <= 0) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'Price must be greater than 0',
      });
    }

    if (Number(stock) < 0) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'Stock must be greater than or equal to 0',
      });
    }

    const imagePath = req.file ? req.file.path.replace(/\\/g, '/') : '';

    const newBook = await Book.create({
      title,
      author,
      description,
      category,
      price: Number(price),
      stock: Number(stock),
      image: imagePath,
      seller: req.user._id,
    });

    if (newBook) {
      // Add book object id to seller's books list
      await Seller.findByIdAndUpdate(req.user._id, {
        $push: { books: newBook._id },
      });

      return res.status(201).json({
        success: true,
        message: 'Book added successfully',
        data: newBook,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid book data provided',
      });
    }
  } catch (error) {
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.error(err);
      }
    }
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error adding book',
    });
  }
};

// @desc    Get my books
// @route   GET /api/seller/my-books
// @access  Private (Seller only)
export const getMyBooks = async (req, res) => {
  try {
    const books = await Book.find({ seller: req.user._id }).populate('seller', 'fullName shopName');
    return res.status(200).json({
      success: true,
      books,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching seller books',
    });
  }
};

// @desc    Get single book belonging to seller
// @route   GET /api/seller/book/:id
// @access  Private (Seller only)
export const getBook = async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id, seller: req.user._id }).populate('seller', 'fullName shopName');
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found or does not belong to this seller',
      });
    }

    return res.status(200).json({
      success: true,
      data: book,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching book',
    });
  }
};

// @desc    Update a book
// @route   PUT /api/seller/update-book/:id
// @access  Private (Seller only)
export const updateBook = async (req, res) => {
  try {
    const { title, author, description, category, price, stock } = req.body;
    const book = await Book.findOne({ _id: req.params.id, seller: req.user._id });

    if (!book) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({
        success: false,
        message: 'Book not found or unauthorized to update this book',
      });
    }

    if (price && Number(price) <= 0) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'Price must be greater than 0',
      });
    }

    if (stock && Number(stock) < 0) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'Stock must be greater than or equal to 0',
      });
    }

    // Delete old image if a new one is uploaded
    if (req.file) {
      if (book.image && fs.existsSync(book.image)) {
        try {
          fs.unlinkSync(book.image);
        } catch (err) {
          console.error('Failed to delete old book image:', err);
        }
      }
      book.image = req.file.path.replace(/\\/g, '/');
    }

    book.title = title || book.title;
    book.author = author || book.author;
    book.description = description || book.description;
    book.category = category || book.category;
    book.price = price !== undefined ? Number(price) : book.price;
    book.stock = stock !== undefined ? Number(stock) : book.stock;

    const updatedBook = await book.save();

    return res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      data: updatedBook,
    });
  } catch (error) {
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.error(err);
      }
    }
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error updating book',
    });
  }
};

// @desc    Delete a book
// @route   DELETE /api/seller/delete-book/:id
// @access  Private (Seller only)
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id, seller: req.user._id });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found or unauthorized to delete this book',
      });
    }

    // Delete the image file on server
    if (book.image && fs.existsSync(book.image)) {
      try {
        fs.unlinkSync(book.image);
      } catch (err) {
        console.error('Failed to delete image file during book deletion:', err);
      }
    }

    // Pull from seller's books array
    await Seller.findByIdAndUpdate(req.user._id, {
      $pull: { books: book._id },
    });

    await Book.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Book deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error deleting book',
    });
  }
};

// @desc    Get seller orders
// @route   GET /api/seller/my-orders
// @access  Private (Seller only)
export const sellerOrders = async (req, res) => {
  try {
    const myBooks = await Book.find({ seller: req.user._id });
    const bookIds = myBooks.map((b) => b._id);

    // Find orders that contain at least one of seller's books
    const orders = await MyOrder.find({ 'items.book': { $in: bookIds } })
      .populate('user', 'fullName email phone address')
      .populate('items.book')
      .sort({ createdAt: -1 });

    // Filter order items to only expose items that belong to this seller
    const sanitizedOrders = orders.map(order => {
      const orderObj = order.toObject();
      orderObj.items = orderObj.items.filter(item => {
        return item.seller?.toString() === req.user._id.toString();
      });
      return orderObj;
    });

    return res.status(200).json({
      success: true,
      message: 'Seller orders fetched successfully',
      data: sanitizedOrders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching seller orders',
    });
  }
};

// @desc    Update order status
// @route   PUT /api/seller/update-order/:id
// @access  Private (Seller only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, bookId, estimatedDelivery } = req.body;
    const allowedStatuses = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Out For Delivery', 'Delivered', 'Cancelled'];

    if (!orderStatus || !allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Please provide a valid orderStatus. Allowed: ${allowedStatuses.join(', ')}`,
      });
    }

    if (!bookId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide bookId to update a specific item status',
      });
    }

    const order = await MyOrder.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Find the specific item belonging to this seller and matching bookId
    const item = order.items.find(
      (item) => item.book.toString() === bookId && item.seller.toString() === req.user._id.toString()
    );

    if (!item) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: This order item does not belong to your shop',
      });
    }

    if (item.status === 'Delivered') {
      return res.status(400).json({
        success: false,
        message: 'Order item has already been Delivered. Inventory status is locked.',
      });
    }

    if (orderStatus === 'Delivered') {
      // Validate stock levels before making any database updates
      const book = await Book.findById(item.book);
      if (!book) {
        return res.status(404).json({
          success: false,
          message: `Book listing not found for ID: ${item.book}`,
        });
      }

      if (book.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for book "${book.title}". Available: ${book.stock}, Ordered: ${item.quantity}. Cannot complete delivery.`,
        });
      }

      // Deduct stock for this item
      book.stock = Math.max(0, book.stock - item.quantity);
      await book.save();

      // Check if all items in this order are now Delivered or Paid, and set paymentStatus
      order.paymentStatus = 'Paid';
    }

    // Update item status and estimatedDelivery
    item.status = orderStatus;
    if (estimatedDelivery !== undefined) {
      item.estimatedDelivery = estimatedDelivery;
    }

    // Maintain global orderStatus field as minimum status for compatibility if needed, or simply synchronize it
    order.orderStatus = orderStatus;

    const updatedOrder = await order.save();
    return res.status(200).json({
      success: true,
      message: 'Order item status updated successfully',
      data: updatedOrder,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error updating order status',
    });
  }
};
