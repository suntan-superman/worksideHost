const RequestTemplate = require("../models/requestTemplateModel");
const asyncHandler = require("express-async-handler");

/**
 * Create a new request template
 * @route POST /api/templates
 * @access Private
 */
exports.createTemplate = asyncHandler(async (req, res) => {
	try {
		const template = await RequestTemplate.create(req.body);

		res.status(201).json({
			success: true,
			data: template,
		});
	} catch (error) {
		if (error.code === 11000) {
			// Duplicate key error
			res.status(400).json({
				success: false,
				error: "Template with this name already exists",
			});
			return;
		}
		throw error;
	}
});

/**
 * Get all templates for a user
 * @route GET /api/templates
 * @access Private
 */
exports.getTemplates = asyncHandler(async (req, res) => {
	const { createdBy } = req.query;

	// Find templates that are either public or created by the user
	const templates = await RequestTemplate.find({
		$or: [{ createdBy }, { visibility: "public" }],
	}).sort({
		createdAt: -1,
	});

	res.status(200).json({
		success: true,
		count: templates.length,
		data: templates,
	});
});

/**
 * Get single template by ID
 * @route GET /api/templates/:id
 * @access Private
 */
exports.getTemplate = asyncHandler(async (req, res) => {
	const template = await RequestTemplate.findOne({
		_id: req.params.id,
		createdBy: req.user.id,
	});

	if (!template) {
		res.status(404).json({
			success: false,
			error: "Template not found",
		});
		return;
	}

	res.status(200).json({
		success: true,
		data: template,
	});
});

/**
 * Update template
 * @route PUT /api/templates/:id
 * @access Private
 */
exports.updateTemplate = asyncHandler(async (req, res) => {
	let template = await RequestTemplate.findOne({
		_id: req.params.id,
		createdBy: req.user.id,
	});

	if (!template) {
		res.status(404).json({
			success: false,
			error: "Template not found",
		});
		return;
	}

	template = await RequestTemplate.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		success: true,
		data: template,
	});
});

/**
 * Delete template
 * @route DELETE /api/templates/:id
 * @access Private
 */
exports.deleteTemplate = asyncHandler(async (req, res) => {
	const template = await RequestTemplate.findOne({
		_id: req.params.id,
		createdBy: req.user.id,
	});

	if (!template) {
		res.status(404).json({
			success: false,
			error: "Template not found",
		});
		return;
	}

	await template.remove();

	res.status(200).json({
		success: true,
		data: {},
	});
}); 