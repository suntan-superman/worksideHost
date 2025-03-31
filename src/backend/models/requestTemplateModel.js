const mongoose = require("mongoose");

/**
 * Request Template Schema
 * @typedef {Object} RequestTemplate
 * @property {string} name - Template name (required, unique)
 * @property {string} description - Template description
 * @property {string} category - Request category (required)
 * @property {string} product - Product name (required)
 * @property {string} comment - Additional comments
 * @property {number} quantity - Request quantity (min: 1)
 * @property {string} preferredVendorType - Vendor type (MSA, OPEN, or SSR)
 * @property {string} preferredVendor - Preferred vendor name
 * @property {string} createdBy - User ID who created the template
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */
const RequestTemplateSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Template name is required"],
			trim: true,
			unique: true,
			maxLength: [100, "Template name cannot exceed 100 characters"],
		},
		description: {
			type: String,
			trim: true,
			maxLength: [500, "Description cannot exceed 500 characters"],
		},
		category: {
			type: String,
			required: [true, "Category is required"],
			trim: true,
		},
		product: {
			type: String,
			required: [true, "Product is required"],
			trim: true,
		},
		comment: {
			type: String,
			trim: true,
			maxLength: [1000, "Comment cannot exceed 1000 characters"],
		},
		quantity: {
			type: Number,
			min: [1, "Quantity must be at least 1"],
			default: 1,
		},
		preferredVendorType: {
			type: String,
			required: [true, "Vendor type is required"],
			enum: {
				values: ["MSA", "OPEN", "SSR"],
				message: "Invalid vendor type. Must be MSA, OPEN, or SSR",
			},
		},
		preferredVendor: {
			type: String,
			trim: true,
		},
		createdBy: {
			type: String,
			required: [true, "Creator ID is required"],
		},
		visibility: {
			type: String,
			enum: {
				values: ["private", "public"],
				message: "Visibility must be either private or public",
			},
			default: "private",
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

// Indexes for improved query performance
RequestTemplateSchema.index({ createdBy: 1 });
RequestTemplateSchema.index({ name: 1 }, { unique: true });

// Pre-save middleware for data validation
RequestTemplateSchema.pre("save", function (next) {
	// Validate preferredVendor is set when type is SSR
	if (this.preferredVendorType === "SSR" && !this.preferredVendor) {
		next(new Error("Preferred vendor is required for SSR type"));
	}
	next();
});

module.exports = mongoose.model("RequestTemplate", RequestTemplateSchema);
