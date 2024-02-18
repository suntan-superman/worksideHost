const mongoose = require('mongoose');
const Project = require('../models/projectModel');

// Get All Projects
const getProjects = async (req, res) => {
  // Sort: O is Ascending and -1 for Descending
  const projects = await Project.find({}).sort({ projectname: 0 });
  res.status(200).json(projects);
};

// Get One Project
const getProject = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such Project Id' });
  }
  const project = await Project.findById(id);

  if (!project) {
    return res.status(404).json({ error: 'No such Project' });
  }
  return res.status(200).json(project);
};

// Create a New Project
const createProject = async (req, res) => {
  // eslint-disable-next-line camelcase
  const { customerid,
    customercontactid,
    rigcompanyid,
    projectname,
    description,
    projectedstartdate,
    actualstartdate,
    expectedduration,
    actualduration,
    status,
    statusdate,
    comment,
    latdec,
    longdec } = req.body;

  try {
    // eslint-disable-next-line camelcase
    const project = await Project.create({ customercontactid,
      rigcompanyid,
      projectname,
      description,
      projectedstartdate,
      actualstartdate,
      expectedduration,
      actualduration,
      status,
      statusdate,
      comment,
      latdec,
      longdec });
    res.status(200).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a Project
const deleteProject = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such Project Id' });
  }
  const project = await Project.findOneAndDelete({ _id: id });

  if (!project) {
    return res.status(400).json({ error: 'No such Project' });
  }
  return res.status(200).json(project);
};

// Update a Project
const updateProject = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such Project Id' });
  }
  const project = await Project.findOneAndUpdate({ _id: id }, {
    ...req.body });

  if (!project) {
    return res.status(400).json({ error: 'No such Project' });
  }
  return res.status(200).json(project);
};

module.exports = {
  getProjects,
  getProject,
  createProject,
  deleteProject,
  updateProject,
};
