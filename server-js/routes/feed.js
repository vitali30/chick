const express = require('express');
const router = express.Router();
const controller = require('../controllers/feed');

router.post('/', controller.addOnePost);

router.get('/', controller.getAllFeedPosts);

router.delete('/:id', controller.deletePostById);

router.put('/name/:id', controller.updateName);

router.put('/body/:id', controller.updateBody)


module.exports = router;