const express = require('express');
const router = express.Router();
const { createBrand, createCreator, getSummary, getAllBillings } = require('../controllers/Billing.controllers');

router.post('/brand', createBrand);
router.post('/creator', createCreator);
router.get('/summary/:id', getSummary);
router.get('/billings', getAllBillings);

module.exports = router;
