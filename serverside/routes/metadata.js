const express = require('express');
const router = express.Router();
const { fetchMetadata } = require('../controllers/metadataController');

router.get('/', fetchMetadata);

module.exports = router;
