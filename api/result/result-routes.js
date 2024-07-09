const express = require('express');
const router = express.Router();
const resultController = require('./result-controller'); // Adjust path based on your file structure

router.post('/', resultController.createResult);
router.get('/', resultController.getResultList);
router.get('/:id', resultController.getResultById);
router.put('/:id', resultController.updateResult);
router.delete('/:id', resultController.deleteResult);

module.exports = router;
