require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const Transaction = require('../models/Transaction');
const Activity = require('../models/Activity');
const Notification = require('../models/Notification');
const Settings = require('../models/Settings');

const firstNames = ['Alex', 'Sam', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Quinn', 'Avery', 'Reese', 'Sky', 'Drew', 'Blake', 'Cameron', 'Dakota', 'Emerson', 'Finley', 'Hayden', 'Jamie', 'Kendall'];
const lastNames = ['Chen', 'Patel', 'Garcia', 'Kim', 'Singh', 'Nguyen', 'Lopez', 'Smith', 'Brown', 'Wilson', 'Davis', 'Miller', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Moore'];
const countries = ['USA', 'UK', 'Canada', 'Germany', 'France', 'Japan', 'Australia', 'Brazil', 'India', 'Egypt'];
const companies = ['Acme Inc', 'Globex', 'Initech', 'Umbrella Co', 'Wayne Enterprises', 'Stark Industries', 'Soylent Corp', 'Cyberdyne', 'Tyrell Corp', 'Pied Piper'];
const plans = ['free', 'starter', 'pro', 'enterprise'];
const planPrices = { free: 0, starter: 19, pro: 49, enterprise: 199 };

const random = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomDate = (start, end) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const seed = async () => {
  await connectDB();
  console.log('✓ Clearing existing data...');

  await Promise.all([
    User.deleteMany({}),
    Subscription.deleteMany({}),
    Transaction.deleteMany({}),
    Activity.deleteMany({}),
    Notification.deleteMany({}),
    Settings.deleteMany({}),
  ]);

  console.log('✓ Creating users...');

  // Admin
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
    plan: 'enterprise',
    status: 'active',
    company: 'SaaS Admin Co',
    country: 'USA',
    avatar: '',
  });

  // Manager
  await User.create({
    name: 'Manager Demo',
    email: 'manager@example.com',
    password: 'password123',
    role: 'manager',
    plan: 'pro',
    status: 'active',
    company: 'SaaS Admin Co',
    country: 'UK',
  });

  // Regular user
  await User.create({
    name: 'Regular User',
    email: 'user@example.com',
    password: 'password123',
    role: 'user',
    plan: 'starter',
    status: 'active',
    company: 'Acme Inc',
    country: 'Canada',
  });

  // Generate 80 random users spread across the last 12 months
  const now = new Date();
  const oneYearAgo = new Date(now);
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const users = [];
  for (let i = 0; i < 80; i++) {
    const first = random(firstNames);
    const last = random(lastNames);
    const plan = random(plans);
    const created = randomDate(oneYearAgo, now);

    const user = await User.create({
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}${i}@example.com`,
      password: 'password123',
      role: 'user',
      plan,
      status: Math.random() > 0.95 ? 'suspended' : Math.random() > 0.9 ? 'pending' : 'active',
      company: random(companies),
      country: random(countries),
      lastLogin: randomDate(created, now),
      loginCount: randomInt(1, 200),
      createdAt: created,
    });
    // Override createdAt by saving directly through the collection (timestamps would override)
    await User.updateOne({ _id: user._id }, { createdAt: created });
    users.push(user);
  }

  console.log(`✓ Created ${users.length + 3} users`);
  console.log('✓ Creating subscriptions...');

  const subs = [];
  for (const user of users) {
    if (user.plan === 'free') continue;
    const interval = Math.random() > 0.7 ? 'yearly' : 'monthly';
    const baseAmount = planPrices[user.plan];
    const amount = interval === 'yearly' ? baseAmount * 10 : baseAmount;
    const status =
      user.status === 'suspended'
        ? 'cancelled'
        : Math.random() > 0.85
        ? 'past_due'
        : 'active';

    const sub = await Subscription.create({
      user: user._id,
      plan: user.plan,
      amount,
      interval,
      status,
      startDate: user.createdAt,
      cancelledAt: status === 'cancelled' ? new Date() : null,
    });
    subs.push(sub);
  }

  console.log(`✓ Created ${subs.length} subscriptions`);
  console.log('✓ Creating transactions...');

  let txCount = 0;
  for (const sub of subs) {
    // Each subscription generates several past transactions
    const monthsBack = randomInt(1, 12);
    for (let i = 0; i < monthsBack; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      date.setDate(randomInt(1, 28));

      const status = Math.random() > 0.92 ? (Math.random() > 0.5 ? 'failed' : 'pending') : 'succeeded';

      const tx = await Transaction.create({
        user: sub.user,
        subscription: sub._id,
        amount: sub.amount,
        currency: 'USD',
        type: 'subscription',
        status,
        description: `${sub.plan} plan - ${sub.interval}`,
      });
      await Transaction.updateOne({ _id: tx._id }, { createdAt: date });
      txCount++;
    }
  }
  console.log(`✓ Created ${txCount} transactions`);

  console.log('✓ Creating activity logs...');
  const actions = ['login', 'logout', 'update_profile', 'create_user', 'update_user', 'cancel_subscription', 'register'];
  for (let i = 0; i < 50; i++) {
    const u = random([admin, ...users.slice(0, 20)]);
    await Activity.create({
      user: u._id,
      action: random(actions),
      entity: 'User',
      description: `${u.email} performed an action`,
      ipAddress: `192.168.${randomInt(0, 255)}.${randomInt(0, 255)}`,
    });
  }

  console.log('✓ Creating notifications for admin...');
  await Notification.create([
    {
      user: admin._id,
      title: 'Welcome to SaaS Admin',
      message: 'Your dashboard is ready. Explore users, subscriptions, and analytics.',
      type: 'info',
    },
    {
      user: admin._id,
      title: 'New subscription',
      message: 'A user upgraded to the Pro plan.',
      type: 'success',
    },
    {
      user: admin._id,
      title: 'Payment failed',
      message: 'A payment requires attention in the transactions tab.',
      type: 'warning',
    },
    {
      user: admin._id,
      title: 'System update available',
      message: 'A new version of the dashboard is available.',
      type: 'system',
    },
  ]);

  console.log('✓ Creating settings...');
  await Settings.create({});

  console.log('\n========================================');
  console.log('✓ Seed complete!');
  console.log('========================================');
  console.log('Login credentials:');
  console.log('  Admin:   admin@example.com / password123');
  console.log('  Manager: manager@example.com / password123');
  console.log('  User:    user@example.com / password123');
  console.log('========================================\n');

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
