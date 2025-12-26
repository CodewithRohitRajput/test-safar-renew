const authMiddleware  = require('../middleware/logger')

const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/LocationController');
// 
// router.use(authMiddleware);

const uploadFields = ctrl.upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'feature_images', maxCount: 10 }
]);

router.post('/', uploadFields, ctrl.create);
router.get('/', ctrl.getAll);
router.get('/paginate', ctrl.findByPage);
router.get('/:id/image', ctrl.getImage);
router.get('/:id/feature-image/:index', ctrl.getFeatureImage);
router.get('/:id', ctrl.getOne);
router.put('/:id', uploadFields, ctrl.update);
router.delete('/:id', ctrl.delete);
module.exports = router;
