import Seller from '../models/Seller.js';
import Book from '../models/Book.js';

export const initDemoData = async () => {
  try {
    console.log('Running demo data initializer...');

    // Attempt to drop the old legacy unique isbn index if it exists in the collection
    try {
      await Book.collection.dropIndex('isbn_1');
      console.log('Successfully dropped legacy isbn_1 unique index.');
    } catch (e) {
      // Index might not exist, which is fine
    }

    // 1. Create Demo Seller if not exists
    let seller = await Seller.findOne({ email: 'seller@bookverse.com' });
    if (!seller) {
      console.log('Demo Seller not found. Creating Demo Seller...');
      seller = await Seller.create({
        fullName: 'Demo Seller',
        shopName: 'BookVerse Store',
        email: 'seller@bookverse.com',
        password: 'Seller@123',
        phone: '9876543210',
        address: 'Hyderabad, India',
        isApproved: true,
      });
      console.log('Demo Seller created successfully.');
    } else {
      console.log('Demo Seller already exists.');
    }

    // List of approximately 15 realistic books with ₹ prices
    const demoBooksList = [
      {
        title: 'Atomic Habits',
        author: 'James Clear',
        category: 'Biographies',
        description: 'A revolutionary system to get 1% better every day. Build good habits, break bad ones, and achieve remarkable results.',
        price: 450,
        stock: 15,
      },
      {
        title: 'The Alchemist',
        author: 'Paulo Coelho',
        category: 'Fiction',
        description: 'A beautiful story about following your dreams, listening to your heart, and reading the omens strewn along life\'s path.',
        price: 350,
        stock: 8,
      },
      {
        title: 'Think and Grow Rich',
        author: 'Napoleon Hill',
        category: 'Biographies',
        description: 'The landmark bestseller that teaches the famous Andrew Carnegie formula for money-making success.',
        price: 299,
        stock: 5,
      },
      {
        title: 'Rich Dad Poor Dad',
        author: 'Robert T. Kiyosaki',
        category: 'Science',
        description: 'What the rich teach their kids about money that the poor and middle class do not! Explodes the myth that you need a high income to become rich.',
        price: 399,
        stock: 20,
      },
      {
        title: 'Ikigai',
        author: 'Héctor García',
        category: 'Biographies',
        description: 'The Japanese secret to a long and happy life. Learn how to find your reason for being.',
        price: 399,
        stock: 12,
      },
      {
        title: 'Deep Work',
        author: 'Cal Newport',
        category: 'Science',
        description: 'Rules for focused success in a distracted world. One of the most valuable skills in our economy is becoming increasingly rare.',
        price: 450,
        stock: 10,
      },
      {
        title: 'The Psychology of Money',
        author: 'Morgan Housel',
        category: 'Science',
        description: 'Timeless lessons on wealth, greed, and happiness. Doing well with money isn\'t necessarily about what you know. It\'s about how you behave.',
        price: 350,
        stock: 25,
      },
      {
        title: 'The Power of Habit',
        author: 'Charles Duhigg',
        category: 'Science',
        description: 'Why we do what we do in life and business. An investigative reporter explores the scientific discoveries that explain how habits work.',
        price: 400,
        stock: 14,
      },
      {
        title: 'The 7 Habits of Highly Effective People',
        author: 'Stephen R. Covey',
        category: 'Biographies',
        description: 'A holistic, integrated, principle-centered approach for solving personal and professional problems.',
        price: 499,
        stock: 18,
      },
      {
        title: 'Zero to One',
        author: 'Peter Thiel',
        category: 'Science',
        description: 'Notes on startups, or how to build the future. How to find singular ways to create those new things.',
        price: 450,
        stock: 9,
      },
      {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        category: 'Science',
        description: 'A handbook of agile software craftsmanship. Master the art of writing clean, maintainable, and readable code.',
        price: 650,
        stock: 10,
      },
      {
        title: 'The Pragmatic Programmer',
        author: 'Andrew Hunt',
        category: 'Science',
        description: 'From journeyman to master. The book cuts through the increasing specialization of modern software development.',
        price: 750,
        stock: 7,
      },
      {
        title: 'Harry Potter and the Philosopher\'s Stone',
        author: 'J.K. Rowling',
        category: 'Fiction',
        description: 'The magic begins. Harry Potter has never even heard of Hogwarts when the letters start dropping on the doormat.',
        price: 499,
        stock: 22,
      },
      {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        category: 'Fiction',
        description: 'A lawyer defends a black man accused of raping a white girl in a small Alabama town. Compassionate, dramatic, and deeply moving.',
        price: 299,
        stock: 11,
      },
      {
        title: '1984',
        author: 'George Orwell',
        category: 'Fiction',
        description: 'The classic dystopian novel about government surveillance, totalitarianism, and the power of propaganda.',
        price: 299,
        stock: 15,
      },
      {
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        category: 'Romance',
        description: 'The romantic clash between the opinionated Elizabeth Bennet and her proud beau, Mr. Darcy, is a classic tale of love and social standing.',
        price: 250,
        stock: 12,
      },
      {
        title: 'The Notebook',
        author: 'Nicholas Sparks',
        category: 'Romance',
        description: 'An epic love story of Noah and Allie, whose journey of passion, devotion, and resilience transcended decades.',
        price: 299,
        stock: 10,
      },
      {
        title: 'Me Before You',
        author: 'Jojo Moyes',
        category: 'Romance',
        description: 'A heartbreakingly romantic novel that asks: What do you do when making the person you love happy also means breaking your own heart?',
        price: 350,
        stock: 8,
      },
      {
        title: 'It Ends With Us',
        author: 'Colleen Hoover',
        category: 'Romance',
        description: 'A brave and heartbreaking novel that digs its claws into you and doesn\'t let go, telling the story of love, pain, and resilience.',
        price: 399,
        stock: 15,
      },
      {
        title: 'Dracula',
        author: 'Bram Stoker',
        category: 'Horror',
        description: 'The classic gothic horror story of Count Dracula trying to move from Transylvania to England to spread his curse.',
        price: 199,
        stock: 14,
      },
      {
        title: 'IT',
        author: 'Stephen King',
        category: 'Horror',
        description: 'Seven teenagers in a small Maine town face a shapeshifting terror that feeds on children\'s fears, manifesting as Pennywise the Clown.',
        price: 499,
        stock: 9,
      },
      {
        title: 'The Shining',
        author: 'Stephen King',
        category: 'Horror',
        description: 'Jack Torrance becomes the caretaker of the Overlook Hotel, where the hotel\'s dark, supernatural past slowly drives him to madness.',
        price: 450,
        stock: 8,
      },
      {
        title: 'Pet Sematary',
        author: 'Stephen King',
        category: 'Horror',
        description: 'Dr. Louis Creed discovers a mysterious burial ground hidden deep in the Maine woods that possesses the power of resurrection, but at a horrific cost.',
        price: 399,
        stock: 10,
      },
    ];

    let newBooksAdded = 0;
    const sellerBookIds = [...(seller.books || [])];

    for (const bookData of demoBooksList) {
      // Check if book exists by title
      const existingBook = await Book.findOne({ title: bookData.title });
      if (!existingBook) {
        // Create book
        const newBook = await Book.create({
          ...bookData,
          seller: seller._id,
          image: '', // will fallback to public covers on client-side
          averageRating: 0,
          reviews: [],
        });
        sellerBookIds.push(newBook._id);
        newBooksAdded++;
      }
    }

    if (newBooksAdded > 0) {
      seller.books = sellerBookIds;
      await seller.save();
      console.log(`Successfully added ${newBooksAdded} demo books.`);
    } else {
      console.log('All demo books already exist in database.');
    }

    console.log('Demo data initialization checks completed.');
  } catch (error) {
    console.error(`Demo data initialization failed: ${error.message}`);
  }
};
