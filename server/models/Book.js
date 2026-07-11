import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: [0.01, 'Price must be greater than 0'],
    },
    stock: {
      type: Number,
      required: true,
      min: [0, 'Stock must be greater than or equal to 0'],
    },
    image: {
      type: String,
      default: '',
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Seller',
      required: true,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  }
);

// Indexes
bookSchema.index({ title: 1 });
bookSchema.index({ author: 1 });
bookSchema.index({ category: 1 });

// Text search index
bookSchema.index({ title: 'text', author: 'text', category: 'text' });

const Book = mongoose.model('Book', bookSchema);

export default Book;
