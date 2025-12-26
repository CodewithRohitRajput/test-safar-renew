const authMiddleware  = require('../middleware/logger')
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/ReviewController');

// Public routes (no auth required)
router.get('/', ctrl.getAll); // Make this public
router.get('/paginate', ctrl.findByPage);

// Protected routes (auth required)
router.post('/', authMiddleware, ctrl.create);
router.get('/:id', ctrl.getOne);
router.put('/:id', authMiddleware, ctrl.update);
router.delete('/:id', authMiddleware, ctrl.delete);

module.exports = router;