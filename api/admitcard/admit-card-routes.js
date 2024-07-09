// admit-card-routes.js
const express = require('express');
const router = express.Router();
const admitCardController = require('./admit-card-controller');

router.post('/', admitCardController.createAdmitCard);
router.get('/', admitCardController.getAdmitCardList);
router.get('/:id', admitCardController.getAdmitCardById);
router.put('/:id', admitCardController.updateAdmitCard);
router.delete('/:id', admitCardController.deleteAdmitCard);

module.exports = router;
