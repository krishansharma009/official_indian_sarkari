const express = require('express');
const router = express.Router();
const answerKeyController = require('./answer-key-controller'); // Corrected import name

router.post('/', answerKeyController.createAnswerKey); // Corrected function name
router.get('/', answerKeyController.getAnswerKeyList); // Corrected function name
router.get('/:id', answerKeyController.getAnswerKeyById); // Corrected function name
router.put('/:id', answerKeyController.updateAnswerKey); // Corrected function name
router.delete('/:id', answerKeyController.deleteAnswerKey); // Corrected function name

module.exports = router;
