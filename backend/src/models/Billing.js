const mongoose = require('mongoose');
const BillingSchema = new mongoose.Schema({
  brandBilling: {
    company: String,
    GSTIN: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    email: String,
    phone: String,
    budgetINR: Number,
    paymentMethod: String,
    tax: Number,
    totalWithTax: Number
  },
  creatorPayout: {
    name: String,
    PAN: String,
    UPI: String,
    bankName: String,
    accountNumber: String,
    IFSC: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    amountINR: Number
  }
}, { timestamps: true });

module.exports = mongoose.model('Billing', BillingSchema);
