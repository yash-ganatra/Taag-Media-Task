
const Billing = require('../models/Billing');

const GST_RATE = Number(process.env.GST_RATE) || 0.18;

async function createBrandBilling(data){
  const tax = Math.round((data.budgetINR || 0) * GST_RATE);
  const totalWithTax = (data.budgetINR || 0) + tax;
  const billing = await Billing.create({
    brandBilling: {
      ...data,
      tax,
      totalWithTax
    }
  });
  return billing;
}

async function addCreatorPayout(billingId, payout){
  const billing = await Billing.findById(billingId);
  if(!billing) throw new Error('Billing not found');
  billing.creatorPayout = payout;
  await billing.save();
  return billing;
}

module.exports = { createBrandBilling, addCreatorPayout };
