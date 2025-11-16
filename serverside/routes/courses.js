const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/courseController');
const auth = require('../middleware/authMiddleware');

router.use(auth);

router.post('/', ctrl.createCourse);
router.get('/', ctrl.getCourses);
router.get('/:id', ctrl.getCourse);
router.put('/:id', ctrl.updateCourse);
router.delete('/:id', ctrl.deleteCourse);
router.patch('/:id/progress', ctrl.updateProgress);

module.exports = router;
