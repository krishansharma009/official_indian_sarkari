const express = require('express');
const router = express.Router();
const jobPostController = require('./job-post-controller');

router.post('/', jobPostController.createJobPost);
router.get('/', jobPostController.getJobPostList);
router.get('/:id', jobPostController.getJobPostById);
router.put('/:id', jobPostController.updateJobPost);
router.delete('/:id', jobPostController.deleteJobPost);

module.exports = router;
