const express = require('express');
const router = express.Router();
const authController = require('../userProfile/auth-controller');
const authenticate = require('../../middleware/auth-middleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/users', authenticate, authController.getUserList);
router.get('/users/:id', authenticate, authController.getUserById);
router.put('/users/:id', authenticate, authController.updateUser);
router.delete('/users/:id', authenticate, authController.deleteUser);

module.exports = router;