const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../middleware/upload'); // Multer middleware
router.post('/', upload.single('profileImage'), userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', upload.single('profileImage'), userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
