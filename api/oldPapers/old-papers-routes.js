const express = require('express');
const router = express.Router();
const oldPapersController = require('./old-papers-controller');

router.post('/', oldPapersController.createOldPaper);
router.get('/', oldPapersController.getOldPapersList);
router.get('/:id', oldPapersController.getOldPaperById);
router.put('/:id', oldPapersController.updateOldPaper);
router.delete('/:id', oldPapersController.deleteOldPaper);

module.exports = router;
