require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Creator = require('../models/Creator');
const Brand = require('../models/Brand');
const fs = require('fs');
const path = require('path');

async function seed(){
  await connectDB(process.env.MONGO_URI);
  try{
    // Fix the file names to match actual files
    const creators = JSON.parse(fs.readFileSync(path.join(__dirname,'Creator.json')));
    const brands = JSON.parse(fs.readFileSync(path.join(__dirname,'Brand.json')));
    
    await Creator.deleteMany({});
    await Brand.deleteMany({});
    await Creator.insertMany(creators);
    await Brand.insertMany(brands);
    console.log('Seed done');
    process.exit(0);
  }catch(err){
    console.error(err);
    process.exit(1);
  }
}
seed();