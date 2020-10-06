const express = require('express');
const router = express.Router();
const controller = require('../controllers/admin-rights');

router.post("/admin", controller.adminStatistic);//????????????

module.exports = router; 