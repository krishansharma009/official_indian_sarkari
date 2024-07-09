const express = require('express');
const router = express.Router();
const blogController = require('./blog-controller');

router.post('/', blogController.createBlog);
router.get('/', blogController.getBlogList);
router.get('/:id', blogController.getBlogById);
router.put('/:id', blogController.updateBlog);
router.delete('/:id', blogController.deleteBlog);

module.exports = router;
