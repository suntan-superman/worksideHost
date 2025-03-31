const express = require("express");
const router = express.Router();
const {
	createTemplate,
	getTemplates,
	getTemplate,
	updateTemplate,
	deleteTemplate,
} = require("../controllers/requestTemplateController");

// Remove auth middleware
// router.use(protect);

router.route("/").get(getTemplates).post(createTemplate);

router
	.route("/:id")
	.get(getTemplate)
	.put(updateTemplate)
	.delete(deleteTemplate);

module.exports = router; 