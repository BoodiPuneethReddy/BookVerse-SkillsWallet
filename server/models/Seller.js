import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const sellerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    shopName: {
      type: String,
      default: '',
    },
    profileImage: {
      type: String,
      default: '',
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
    books: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Encrypt password before saving
sellerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password helper
sellerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Seller = mongoose.model('Seller', sellerSchema);

export default Seller;
