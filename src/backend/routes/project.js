const express = require('express');
const {
  getProjects,
  getProject,
  createProject,
  deleteProject,
  updateProject,
} = require('../controllers/projectController');

const router = express.Router();

// Get All Projects
router.get('/', getProjects);

// Get One Project
router.get('/:id', getProject);

// Post a New Project
router.post('/', createProject);

// Delete a Project

router.delete('/:id', deleteProject);

// Update a Project
router.patch('/:id', updateProject);

module.exports = router;
