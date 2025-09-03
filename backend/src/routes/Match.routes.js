const express = require('express');
const router = express.Router();
const { match, getCreators } = require('../controllers/Match.controllers');

router.post('/', match);
router.get('/creators', getCreators);

module.exports = router;
