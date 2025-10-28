const mongoose = require('mongoose');
const Project = require('../models/projectModel');

/**
 * Get all projects
 * @route GET /api/projects
 * @returns {Promise<Array>} Array of projects
 */
const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            tenantId: req.tenantId  // Only projects from user's firm
        }).sort({ projectname: 1 }).lean();

        if (!projects?.length) {
            return res.status(404).json({ message: "No projects found" });
        }

        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching projects",
            error: error.message
        });
    }
};

/**
 * Get project by ID
 * @route GET /api/projects/:id
 * @param {string} id - Project ID
 * @returns {Promise<Object>} Project object
 */
const getProject = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid project ID" });
        }
        const project = await Project.findById(id).lean();
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching project",
            error: error.message
        });
    }
};

/**
 * Create new project
 * @route POST /api/projects
 * @param {Object} body - Project details
 * @returns {Promise<Object>} Created project
 */
const createProject = async (req, res) => {
    try {
        const {
            customer,
            projectname,
            projectedstartdate,
            projectedenddate,
            expectedduration,
            area,
            status,
            description,
            latdec,
            longdec,
            rigcompany,
            customercontact
        } = req.body;

        const requiredFields = [
            "customer",
            "projectname",
            "projectedstartdate",
            "expectedduration"
        ];
        const missingFields = requiredFields.filter((field) => !req.body[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Missing required fields: ${missingFields.join(", ")}`
            });
        }

        const project = await Project.create({
            customer,
            projectname: projectname.trim(),
            projectedstartdate,
            projectedenddate,
            expectedduration,
            area,
            status: status || "PENDING",
            description,
            latdec,
            longdec,
            rigcompany,
            customercontact,
            tenantId: req.tenantId, // CRITICAL: Add tenantId for multi-tenant isolation
        });

        res.status(201).json({
            message: "Project created successfully",
            data: project,
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: "Validation error",
                errors: Object.values(error.errors).map((err) => err.message),
            });
        }
        res.status(500).json({
            message: "Error creating project",
            error: error.message,
        });
    }
};

/**
 * Delete project
 * @route DELETE /api/projects/:id
 * @param {string} id - Project ID
 * @returns {Promise<Object>} Deleted project
 */
const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid project ID" });
        }
        const project = await Project.findByIdAndDelete(id);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.status(200).json({
            message: "Project deleted successfully",
            data: project,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting project",
            error: error.message,
        });
    }
};

/**
 * Update project
 * @route PUT /api/projects/:id
 * @param {string} id - Project ID
 * @param {Object} body - Updated project details
 * @returns {Promise<Object>} Updated project
 */
const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid project ID" });
        }
        const project = await Project.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.status(200).json({
            message: "Project updated successfully",
            data: project,
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: "Validation error",
                errors: Object.values(error.errors).map((err) => err.message),
            });
        }
        res.status(500).json({
            message: "Error updating project",
            error: error.message,
        });
    }
};

/**
 * Get projects by customer name
 * @route GET /api/projects/customer/:customer
 * @param {string} customer - Customer name
 * @returns {Promise<Array>} Array of projects for the customer
 */
const getProjectsByCustomer = async (req, res) => {
    try {
        const { customer } = req.params;
        
        const projects = await Project.find({
            customer: customer,
            tenantId: req.tenantId  // Only projects from user's firm
        }).sort({ projectedstartdate: 1 });
        
        if (!projects || projects.length === 0) {
            return res.status(404).json({ error: "No projects found for this customer" });
        }
        
        return res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching projects by customer",
            error: error.message,
        });
    }
};

/**
 * Get project ID by project name and customer
 * @route GET /api/projects/id-by-name-customer
 * @param {string} projectname - Project name
 * @param {string} customer - Customer name
 * @returns {Promise<Object>} Project ID
 */
const getProjectIdByNameAndCustomer = async (req, res) => {
    try {
        const { projectname, customer } = req.query;
        
        if (!projectname || !customer) {
            return res.status(400).json({ 
                message: "Both projectname and customer are required" 
            });
        }

        const decodedProjectName = decodeURIComponent(projectname).trim();
        const decodedCustomer = decodeURIComponent(customer).trim();
        
        const project = await Project.findOne({
            projectname: { $regex: new RegExp(`^${decodedProjectName}$`, "i") },
            customer: decodedCustomer,
            tenantId: req.tenantId  // Only projects from user's firm
        });

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
                projectname: decodedProjectName,
                customer: decodedCustomer
            });
        }

        res.status(200).json({
            message: "Project found",
            projectId: project._id,
            projectname: decodedProjectName,
            customer: decodedCustomer
        });
    } catch (error) {
        res.status(500).json({
            message: "Error retrieving project ID",
            error: error.message
        });
    }
};

module.exports = {
    getProjects,
    getProject,
    createProject,
    deleteProject,
    updateProject,
    getProjectsByCustomer,
    getProjectIdByNameAndCustomer,
};