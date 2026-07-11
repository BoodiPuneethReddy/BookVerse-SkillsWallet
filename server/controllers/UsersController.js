import User from '../models/User.js';
import Book from '../models/Book.js';
import MyOrder from '../models/MyOrder.js';
import Cart from '../models/Cart.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/users/signup
// @access  Public
export const signup = async (req, res) => {
  try {
    const { fullName, email, password, phone, address } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide fullName, email and password',
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    const user = await User.create({
      fullName,
      email,
      password,
      phone,
      address,
    });

    if (user) {
      const token = generateToken(user._id, 'user');
      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        token,
        data: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          address: user.address,
          wishlist: user.wishlist,
        },
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid user data',
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during user signup',
    });
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
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

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check if user is blocked
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been blocked by Admin. Contact support.',
      });
    }

    if (await user.matchPassword(password)) {
      const token = generateToken(user._id, 'user');
      return res.status(200).json({
        success: true,
        message: 'User logged in successfully',
        token,
        data: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          address: user.address,
          wishlist: user.wishlist,
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
      message: error.message || 'Server error during user login',
    });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private (User only)
export const profile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      return res.status(200).json({
        success: true,
        message: 'User profile fetched successfully',
        data: user,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'User profile not found',
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching user profile',
    });
  }
};

// @desc    Browse all books
// @route   GET /api/users/books
// @access  Public
export const getBooks = async (req, res) => {
  try {
    const books = await Book.find({}).populate('seller', 'fullName shopName');
    return res.status(200).json({
      success: true,
      books,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching books',
    });
  }
};

// @desc    Get single book details
// @route   GET /api/users/book/:id
// @access  Public
export const getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('seller', 'fullName shopName')
      .populate('reviews.user', 'fullName');

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: book,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching book details',
    });
  }
};

// @desc    Search books by title, author, or category
// @route   GET /api/users/search
// @access  Public
export const searchBooks = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a search term via query parameter "q"',
      });
    }

    // Regexp regex search for title, author, category
    const searchRegex = new RegExp(q, 'i');
    const books = await Book.find({
      $or: [
        { title: searchRegex },
        { author: searchRegex },
        { category: searchRegex },
      ],
    }).populate('seller', 'fullName shopName');

    return res.status(200).json({
      success: true,
      books,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during book search',
    });
  }
};

// @desc    Place a new order
// @route   POST /api/users/place-order
// @access  Private (User only)
export const placeOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide items for the order',
      });
    }

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: 'Please provide shippingAddress',
      });
    }

    const validPaymentMethods = ['COD', 'UPI', 'Card'];
    if (!paymentMethod || !validPaymentMethods.includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: `Please provide a valid paymentMethod. Allowed: ${validPaymentMethods.join(', ')}`,
      });
    }

    // Process and validate items
    let calculatedTotal = 0;
    const finalItems = [];

    for (const item of items) {
      const book = await Book.findById(item.book);
      if (!book) {
        return res.status(404).json({
          success: false,
          message: `Book with id ${item.book} not found`,
        });
      }

      if (book.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for book "${book.title}". Available: ${book.stock}, Requested: ${item.quantity}`,
        });
      }

      // Calculate item cost
      const itemCost = book.price * item.quantity;
      calculatedTotal += itemCost;

      finalItems.push({
        book: book._id,
        quantity: item.quantity,
        price: book.price,
        seller: book.seller,
        status: 'Pending',
        estimatedDelivery: '',
      });
    }

    const order = await MyOrder.create({
      user: req.user._id,
      items: finalItems,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid', // UPI / Card is marked Paid immediately
      orderStatus: 'Pending',
      totalAmount: calculatedTotal,
    });

    // Clear active user Cart on successful order
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [], subtotal: 0 }
    );

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error placing order',
    });
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/users/my-orders
// @access  Private (User only)
export const myOrders = async (req, res) => {
  try {
    const orders = await MyOrder.find({ user: req.user._id })
      .populate('items.book')
      .populate('items.seller', 'fullName shopName email rating')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching user orders',
    });
  }
};

// @desc    Add a product review
// @route   POST /api/users/review/:id
// @access  Private (User only)
export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide rating and comment',
      });
    }

    const numRating = Number(rating);
    if (numRating < 1 || numRating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5',
      });
    }

    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    // Check if user already reviewed this book
    const alreadyReviewed = book.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      // Update existing review
      alreadyReviewed.rating = numRating;
      alreadyReviewed.comment = comment;
    } else {
      // Add new review
      book.reviews.push({
        user: req.user._id,
        rating: numRating,
        comment,
      });
    }

    // Recalculate average rating
    const totalRating = book.reviews.reduce((acc, r) => acc + r.rating, 0);
    book.averageRating = totalRating / book.reviews.length;

    await book.save();

    return res.status(200).json({
      success: true,
      message: 'Review added successfully',
      data: book,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error adding review',
    });
  }
};

// @desc    Get active user cart
// @route   GET /api/cart
// @access  Private (User only)
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.book');
    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
        subtotal: 0,
      });
    }
    return res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching cart',
    });
  }
};

// @desc    Add / merge book to cart
// @route   POST /api/cart/add
// @access  Private (User only)
export const addToCart = async (req, res) => {
  try {
    const { bookId, quantity } = req.body;
    const qty = Number(quantity) || 1;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [],
        subtotal: 0,
      });
    }

    const existingIndex = cart.items.findIndex(item => item.book.toString() === bookId);
    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += qty;
    } else {
      cart.items.push({
        book: book._id,
        seller: book.seller,
        quantity: qty,
        price: book.price,
      });
    }

    // Recalculate subtotal
    cart.subtotal = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate('items.book');

    return res.status(200).json({
      success: true,
      message: 'Item added to cart',
      data: populatedCart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error adding to cart',
    });
  }
};

// @desc    Update item quantity inside cart
// @route   PUT /api/cart/update
// @access  Private (User only)
export const updateCartQty = async (req, res) => {
  try {
    const { bookId, quantity } = req.body;
    const qty = Number(quantity);

    if (qty < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1',
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    const itemIndex = cart.items.findIndex(item => item.book.toString() === bookId);
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart',
      });
    }

    cart.items[itemIndex].quantity = qty;
    cart.subtotal = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate('items.book');

    return res.status(200).json({
      success: true,
      message: 'Cart updated successfully',
      data: populatedCart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error updating cart',
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:bookId
// @access  Private (User only)
export const removeFromCart = async (req, res) => {
  try {
    const { bookId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    cart.items = cart.items.filter(item => item.book.toString() !== bookId);
    cart.subtotal = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate('items.book');

    return res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: populatedCart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error removing item from cart',
    });
  }
};
