
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/indexController');
router.post('/', ctrl.create);
router.get('/', ctrl.getAll);
router.get('/paginate', ctrl.findByPage);
router.get('/:id', ctrl.getOne);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.delete);
module.exports = router;
