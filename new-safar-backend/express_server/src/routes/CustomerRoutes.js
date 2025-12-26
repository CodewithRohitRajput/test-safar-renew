const express = require('express');
const router = express.Router();
const CustomerController = require('../controllers/CustomerController');

router.post('/', CustomerController.create.bind(CustomerController));
router.get('/', CustomerController.getAll.bind(CustomerController));
router.get('/pagination', CustomerController.getByPagination.bind(CustomerController));
router.get('/booking/:bookingId', CustomerController.getByBookingId.bind(CustomerController));
router.get('/email/:email', CustomerController.getByEmail.bind(CustomerController));
router.get('/:id', CustomerController.getById.bind(CustomerController));
router.put('/:id', CustomerController.update.bind(CustomerController));
router.delete('/:id', CustomerController.delete.bind(CustomerController));

module.exports = router;
