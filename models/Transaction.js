const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription',
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    type: {
      type: String,
      enum: ['subscription', 'one_time', 'refund', 'credit'],
      default: 'subscription',
    },
    status: {
      type: String,
      enum: ['pending', 'succeeded', 'failed', 'refunded'],
      default: 'pending',
    },
    description: { type: String, default: '' },
    invoiceNumber: { type: String, unique: true, sparse: true },
    paymentMethod: { type: String, default: 'card' },
  },
  { timestamps: true }
);

transactionSchema.pre('save', function (next) {
  if (!this.invoiceNumber) {
    this.invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
  next();
});

module.exports = mongoose.model('Transaction', transactionSchema);
