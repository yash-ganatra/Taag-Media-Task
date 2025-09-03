const Joi = require('joi');
const { isValidPAN, isValidGSTIN, isValidIFSC, isValidUPI } = require('../utils/Validators');
const { createBrandBilling, addCreatorPayout } = require('../services/Billing.services');
const Billing = require('../models/Billing');

const brandSchema = Joi.object({
  company: Joi.string().required(),
  GSTIN: Joi.string().required(),
  address: Joi.string().optional(),
  city: Joi.string().optional(),
  state: Joi.string().optional(),
  pincode: Joi.string().optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().optional(),
  budgetINR: Joi.number().required(),
  paymentMethod: Joi.string().optional()
});

const creatorSchema = Joi.object({
  billingId: Joi.string().required(),
  name: Joi.string().required(),
  PAN: Joi.string().required(),
  UPI: Joi.string().optional(),
  bankName: Joi.string().optional(),
  accountNumber: Joi.string().optional(),
  IFSC: Joi.string().optional(),
  address: Joi.string().optional(),
  city: Joi.string().optional(),
  state: Joi.string().optional(),
  pincode: Joi.string().optional(),
  amountINR: Joi.number().required()
});

async function createBrand(req, res){
  try{
    const { error, value } = brandSchema.validate(req.body);
    if(error) return res.status(400).json({ error: error.message });
    if(!isValidGSTIN(value.GSTIN)) return res.status(400).json({ error: 'Invalid GSTIN' });
    const billing = await createBrandBilling(value);
    return res.json({ billingId: billing._id, brandBilling: billing.brandBilling });
  } catch(err){
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}

async function createCreator(req, res){
  try{
    const { error, value } = creatorSchema.validate(req.body);
    if(error) return res.status(400).json({ error: error.message });
    if(value.PAN && !isValidPAN(value.PAN)) return res.status(400).json({ error: 'Invalid PAN' });
    if(value.IFSC && !isValidIFSC(value.IFSC)) return res.status(400).json({ error: 'Invalid IFSC' });
    if(value.UPI && !isValidUPI(value.UPI)) return res.status(400).json({ error: 'Invalid UPI' });

    const billing = await addCreatorPayout(value.billingId, {
      name: value.name,
      PAN: value.PAN,
      UPI: value.UPI,
      bankName: value.bankName,
      accountNumber: value.accountNumber,
      IFSC: value.IFSC,
      address: value.address,
      city: value.city,
      state: value.state,
      pincode: value.pincode,
      amountINR: value.amountINR
    });
    return res.json({ billingId: billing._id, billing });
  } catch(err){
    console.error(err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}

async function getSummary(req, res){
  try{
    const id = req.params.id;
    const billing = await Billing.findById(id).lean();
    if(!billing) return res.status(404).json({ error: 'Not found' });
    return res.json({ billing });
  } catch(err){
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}

async function getAllBillings(req, res){
  try{
    const billings = await Billing.find({}, {
      _id: 1,
      'brandBilling.company': 1,
      'brandBilling.budgetINR': 1,
      'brandBilling.totalWithTax': 1,
      createdAt: 1,
      creatorPayout: 1
    }).sort({ createdAt: -1 }).lean();
    
    const formattedBillings = billings.map(billing => ({
      billingId: billing._id,
      company: billing.brandBilling?.company || 'Unknown',
      budget: billing.brandBilling?.budgetINR || 0,
      total: billing.brandBilling?.totalWithTax || 0,
      date: billing.createdAt,
      hasCreatorPayout: !!billing.creatorPayout
    }));
    
    return res.json({ billings: formattedBillings });
  } catch(err){
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { createBrand, createCreator, getSummary, getAllBillings };
