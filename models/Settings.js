const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: 'SaaS Admin' },
    siteDescription: { type: String, default: 'A modern SaaS platform' },
    supportEmail: { type: String, default: 'support@example.com' },
    maintenanceMode: { type: Boolean, default: false },
    allowSignup: { type: Boolean, default: true },
    emailNotifications: { type: Boolean, default: true },
    twoFactorRequired: { type: Boolean, default: false },
    plans: {
      type: [
        {
          name: String,
          price: Number,
          features: [String],
          popular: Boolean,
        },
      ],
      default: [
        { name: 'Free', price: 0, features: ['1 project', '100 MB storage'], popular: false },
        { name: 'Starter', price: 19, features: ['10 projects', '5 GB storage', 'Email support'], popular: false },
        { name: 'Pro', price: 49, features: ['Unlimited projects', '50 GB storage', 'Priority support', 'API access'], popular: true },
        { name: 'Enterprise', price: 199, features: ['Everything in Pro', 'Dedicated support', 'Custom integrations', 'SLA'], popular: false },
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settings', settingsSchema);
