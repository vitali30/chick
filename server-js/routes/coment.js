const express = require('express');
const router = express.Router();
const controller = require('../controllers/coment');

router.post('/', controller.addOneComent);

router.get('/', controller.getAllComents);

// router.delete('/:id', controller.deletePostById);

// router.put('/name/:id', controller.updateName);

// router.put('/body/:id', controller.updateBody)


module.exports = router;