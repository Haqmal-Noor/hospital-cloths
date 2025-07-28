import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Order from '../models/Order.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/clothing-orders');
    console.log('MongoDB Connected for seeding');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const seedUsers = async () => {
  const users = [
    {
      name: 'Admin User',
      email: 'admin@clothingstore.com',
      password: 'admin123',
      role: 'admin'
    },
    {
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      password: 'customer123',
      role: 'customer',
      phone: '+1-555-0101'
    },
    {
      name: 'Mike Visitor',
      email: 'mike@example.com',
      password: 'visitor123',
      role: 'visitor',
      commissionRate: 15,
      phone: '+1-555-0102'
    },
    {
      name: 'Emma Tailor',
      email: 'emma@example.com',
      password: 'tailor123',
      role: 'tailor',
      phone: '+1-555-0103'
    },
    {
      name: 'John Customer',
      email: 'john@example.com',
      password: 'customer123',
      role: 'customer',
      phone: '+1-555-0104'
    }
  ];

  await User.deleteMany({});
  const createdUsers = await User.insertMany(users);
  console.log('Users seeded successfully');
  return createdUsers;
};

const seedOrders = async (users) => {
  const customer1 = users.find(u => u.email === 'sarah@example.com');
  const customer2 = users.find(u => u.email === 'john@example.com');
  const visitor = users.find(u => u.role === 'visitor');
  const tailor = users.find(u => u.role === 'tailor');

  const orders = [
    {
      customerId: customer1._id,
      visitorId: visitor._id,
      tailorId: tailor._id,
      status: 'in-progress',
      itemDetails: {
        type: 'dress',
        measurements: {
          chest: 36,
          waist: 28,
          hips: 38,
          length: 45
        },
        fabric: 'Silk',
        color: 'Navy Blue',
        specialInstructions: 'Please add lace trim at the bottom'
      },
      price: 250,
      priority: 'high',
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    },
    {
      customerId: customer2._id,
      status: 'pending',
      itemDetails: {
        type: 'suit',
        measurements: {
          chest: 42,
          waist: 36,
          shoulderWidth: 18,
          armLength: 25,
          inseam: 32
        },
        fabric: 'Wool',
        color: 'Charcoal Gray',
        specialInstructions: 'Standard business cut'
      },
      price: 450,
      priority: 'medium'
    },
    {
      customerId: customer1._id,
      tailorId: tailor._id,
      status: 'completed',
      itemDetails: {
        type: 'blouse',
        measurements: {
          chest: 36,
          waist: 28,
          armLength: 23
        },
        fabric: 'Cotton',
        color: 'White',
        specialInstructions: 'French cuffs preferred'
      },
      price: 120,
      priority: 'low',
      actualDelivery: new Date()
    }
  ];

  await Order.deleteMany({});
  await Order.insertMany(orders);
  console.log('Orders seeded successfully');
};

const seedDatabase = async () => {
  try {
    await connectDB();
    const users = await seedUsers();
    await seedOrders(users);
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();