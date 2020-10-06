const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth');

router.post("/", controller.addUserToData);

router.get('/in/:id', controller.userAuth);

router.get('/esc', controller.userEsc);

router.get('/current', controller.getCurrAuth);

module.exports = router;
