import Admin from '../models/Admin.js';
import Seller from '../models/Seller.js';
import User from '../models/User.js';
import Book from '../models/Book.js';
import MyOrder from '../models/MyOrder.js';

export const seedIfEmpty = async () => {
  try {
    const bookCount = await Book.countDocuments();
    if (bookCount > 0) {
      console.log('Database already seeded');
      return;
    }

    console.log('Database is empty. Seeding default bookstore records...');

    const admin = await Admin.create({
      fullName: 'Super Admin',
      email: 'admin@bookstore.com',
      password: 'adminpassword',
      phone: '1234567890',
      isSuperAdmin: true,
    });

    const seller = await Seller.create({
      fullName: 'Prananshu Bookstore',
      email: 'seller@bookstore.com',
      password: 'sellerpassword',
      phone: '9876543210',
      address: '123 Main Market, Delhi',
      shopName: 'Prananshu Books',
    });

    const user = await User.create({
      fullName: 'Ram Kumar',
      email: 'user@bookstore.com',
      password: 'userpassword',
      phone: '5555555555',
      address: '173, Mayur Vihar Phase-1, Delhi (110091)',
    });

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
      {
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        description: 'The romantic clash between the opinionated Elizabeth Bennet and her proud beau, Mr. Darcy, is a classic tale of love and social standing.',
        category: 'Romance',
        price: 250.0,
        stock: 12,
        seller: seller._id,
        averageRating: 4.5,
        reviews: [],
      },
      {
        title: 'The Notebook',
        author: 'Nicholas Sparks',
        description: 'An epic love story of Noah and Allie, whose journey of passion, devotion, and resilience transcended decades.',
        category: 'Romance',
        price: 299.0,
        stock: 10,
        seller: seller._id,
        averageRating: 4.6,
        reviews: [],
      },
      {
        title: 'Me Before You',
        author: 'Jojo Moyes',
        description: 'A heartbreakingly romantic novel that asks: What do you do when making the person you love happy also means breaking your own heart?',
        category: 'Romance',
        price: 350.0,
        stock: 8,
        seller: seller._id,
        averageRating: 4.7,
        reviews: [],
      },
      {
        title: 'It Ends With Us',
        author: 'Colleen Hoover',
        description: 'A brave and heartbreaking novel that digs its claws into you and doesn\'t let go, telling the story of love, pain, and resilience.',
        category: 'Romance',
        price: 399.0,
        stock: 15,
        seller: seller._id,
        averageRating: 4.4,
        reviews: [],
      },
      {
        title: 'Dracula',
        author: 'Bram Stoker',
        description: 'The classic gothic horror story of Count Dracula trying to move from Transylvania to England to spread his curse.',
        category: 'Horror',
        price: 199.0,
        stock: 14,
        seller: seller._id,
        averageRating: 4.2,
        reviews: [],
      },
      {
        title: 'IT',
        author: 'Stephen King',
        description: 'Seven teenagers in a small Maine town face a shapeshifting terror that feeds on children\'s fears, manifesting as Pennywise the Clown.',
        category: 'Horror',
        price: 499.0,
        stock: 9,
        seller: seller._id,
        averageRating: 4.8,
        reviews: [],
      },
      {
        title: 'The Shining',
        author: 'Stephen King',
        description: 'Jack Torrance becomes the caretaker of the Overlook Hotel, where the hotel\'s dark, supernatural past slowly drives him to madness.',
        category: 'Horror',
        price: 450.0,
        stock: 8,
        seller: seller._id,
        averageRating: 4.7,
        reviews: [],
      },
      {
        title: 'Pet Sematary',
        author: 'Stephen King',
        description: 'Dr. Louis Creed discovers a mysterious burial ground hidden deep in the Maine woods that possesses the power of resurrection, but at a horrific cost.',
        category: 'Horror',
        price: 399.0,
        stock: 10,
        seller: seller._id,
        averageRating: 4.5,
        reviews: [],
      },
    ]);

    seller.books = books.map((b) => b._id);
    await seller.save();

    console.log('Seeding of default records completed successfully!');
  } catch (error) {
    console.error(`Automatic seeding failed: ${error.message}`);
  }
};
