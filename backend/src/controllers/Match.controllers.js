const Joi = require('joi');
const { scoreCreators } = require('../services/Match.service');
const Creator = require('../models/Creator');

const briefSchema = Joi.object({
  category: Joi.string().required(),
  platforms: Joi.array().items(Joi.string()).required(),
  budgetINR: Joi.number().required(),
  targetLocations: Joi.array().items(Joi.string()).required(),
  targetAges: Joi.array().items(Joi.number()).length(2).required(),
  tone: Joi.array().items(Joi.string()),
  constraints: Joi.object().optional()
});

async function match(req, res){
  try{
    const { error, value } = briefSchema.validate(req.body);
    if(error) return res.status(400).json({ error: error.message });

    const results = await scoreCreators(value);
    return res.json({ creators: results });
  } catch(err){
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}

async function getCreators(req, res){
  try{
    const creators = await Creator.find({}).lean();
    return res.json({ creators });
  } catch(err){
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { match, getCreators };
