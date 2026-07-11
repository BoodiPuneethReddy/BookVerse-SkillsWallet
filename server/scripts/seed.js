import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';
import Seller from '../models/Seller.js';
import User from '../models/User.js';
import Book from '../models/Book.js';
import MyOrder from '../models/MyOrder.js';

dotenv.config();

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB for seeding...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected. Clearing database collections...');

    // Clear old data
    await Admin.deleteMany({});
    await Seller.deleteMany({});
    await User.deleteMany({});
    await Book.deleteMany({});
    await MyOrder.deleteMany({});

    console.log('Inserting default admin...');
    const admin = await Admin.create({
      fullName: 'Super Admin',
      email: 'admin@bookstore.com',
      password: 'adminpassword', // Will be hashed via pre-save middleware
      phone: '1234567890',
      isSuperAdmin: true,
    });

    console.log('Inserting default seller...');
    const seller = await Seller.create({
      fullName: 'Prananshu Bookstore',
      email: 'seller@bookstore.com',
      password: 'sellerpassword',
      phone: '9876543210',
      address: '123 Main Market, Delhi',
      shopName: 'Prananshu Books',
    });

    console.log('Inserting default user...');
    const user = await User.create({
      fullName: 'Ram Kumar',
      email: 'user@bookstore.com',
      password: 'userpassword',
      phone: '5555555555',
      address: '173, Mayur Vihar Phase-1, Delhi (110091)',
    });

    console.log('Inserting books list...');
    const books = await Book.insertMany([
      {
        title: 'Atomic Habits',
        author: 'James Clear',
        description: 'A practical guide to building good habits and breaking bad ones, backed by scientific research.',
        category: 'Biographies',
        price: 450.0,
        stock: 15,
        seller: seller._id,
        averageRating: 4.8,
        reviews: [
          {
            user: user._id,
            rating: 5,
            comment: 'Life changing book! Highly recommended to everyone trying to build positive routines.',
          },
        ],
      },
      {
        title: 'The Alchemist',
        author: 'Paulo Coelho',
        description: 'A fable about following your dream. It tells the story of Santiago, an Andalusian shepherd boy who yearns to travel in search of worldly treasure.',
        category: 'Fiction',
        price: 350.0,
        stock: 8,
        seller: seller._id,
        averageRating: 4.5,
        reviews: [],
      },
      {
        title: 'Rich Dad Poor Dad',
        author: 'Robert T. Kiyosaki',
        description: 'It advocates the importance of financial literacy, financial independence and building wealth through investing in assets.',
        category: 'Science',
        price: 399.0,
        stock: 20,
        seller: seller._id,
        averageRating: 4.2,
        reviews: [],
      },
      {
        title: 'Think and Grow Rich',
        author: 'Napoleon Hill',
        description: 'The standard financial planning and personal productivity guide of the 20th century.',
        category: 'Biographies',
        price: 299.0,
        stock: 5,
        seller: seller._id,
        averageRating: 4.0,
        reviews: [],
      },
    ]);

    // Push books to seller list
    seller.books = books.map((b) => b._id);
    await seller.save();

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
