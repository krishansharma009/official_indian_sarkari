const express = require('express');
const router = express.Router();
const bookController = require('./book-controller');

router.post('/', bookController.createBook);
router.get('/', bookController.getBookList);
router.get('/:id', bookController.getBookById);
router.put('/:id', bookController.updateBook);
router.delete('/:id', bookController.deleteBook);

module.exports = router;
