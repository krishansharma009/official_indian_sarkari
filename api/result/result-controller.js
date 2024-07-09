const { check, validationResult } = require('express-validator');
const slugify = require('slugify');
const Result = require("./result");
const REST_API = require("../../utils/crudHelper");
const { Op } = require("sequelize");

// Function to sanitize and slugify the slug field
const sanitizeAndSlugifySlug = (inputSlug) => {
  // Trim leading and trailing spaces
  let slug = inputSlug.trim();

  // Replace multiple spaces with a single space or hyphen
  slug = slug.replace(/\s+/g, ' ');

  // Slugify the sanitized string
  slug = slugify(slug, { lower: true });

  return slug;
};

// Create a result with manually entered slug
const createResult = [
  // Validation middleware
  check('title').notEmpty().withMessage('Title is required'),
  check('slug').notEmpty().withMessage('Slug is required'),
  check('created_by').notEmpty().withMessage('Created by is required'),
  
  // Request handler
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { title, content, slug, metaTags, metaDescription, canonicalUrl, created_by, state, categories } = req.body;

    // Sanitize and slugify the slug field
    slug = sanitizeAndSlugifySlug(slug);

    try {
      const result = await Result.create({ title, content, slug, metaTags, metaDescription, canonicalUrl, created_by, state, categories });
      res.status(200).json(result);
    } catch (error) {
      console.error("Error creating result:", error);
      res.status(500).json({ error: "Failed to create result." });
    }
  }
];

// Get all results with content-based text search
const getResultList = async (req, res) => {
  const { searchQuery } = req.query;
  let whereClause = {};

  if (searchQuery) {
    whereClause = {
      [Op.or]: [
        { title: { [Op.like]: `%${searchQuery}%` } },
        { content: { [Op.like]: `%${searchQuery}%` } }
      ]
    };
  }

  try {
    const results = await Result.findAll({ where: whereClause });

    res.status(200).json(results);
  } catch (error) {
    console.error("Error retrieving results:", error);
    res.status(500).json({ error: "Failed to retrieve results." });
  }
};

// Get result by ID
const getResultById = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await REST_API._getDataListById(req, res, Result, "id", id);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error retrieving result:", error);
    res.status(500).json({ error: "Failed to retrieve result." });
  }
};

// Update a result
const updateResult = [
  check('title').notEmpty().withMessage('Title is required'),
  check('slug').notEmpty().withMessage('Slug is required'),
  check('created_by').notEmpty().withMessage('Created by is required'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { title, content, slug, metaTags, metaDescription, canonicalUrl, created_by, state, categories } = req.body;

    // Sanitize and slugify the slug field
    slug = sanitizeAndSlugifySlug(slug);

    try {
      // Ensure to pass req.params.id or another identifier for the update operation
      const response = await REST_API._update(req, res, Result);
      res.status(200).json(response);
    } catch (error) {
      console.error("Error updating result:", error);
      res.status(500).json({ error: "Failed to update result." });
    }
  }
];

// Delete a result
const deleteResult = async (req, res) => {
  try {
    const response = await REST_API._delete(req, res, Result);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error deleting result:", error);
    res.status(500).json({ error: "Failed to delete result." });
  }
};

// Function to get result by ID
const getResultByKeyById = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await REST_API._getDataListById(req, res, Result, "id", id);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error retrieving result:", error);
    res.status(500).json({ error: "Failed to retrieve result." });
  }
};

// Function to get list of results
const getResultsByKeyList = async (req, res) => {
  const { searchQuery } = req.query;
  let whereClause = {};

  if (searchQuery) {
    whereClause = {
      [Op.or]: [
        { title: { [Op.like]: `%${searchQuery}%` } },
        { content: { [Op.like]: `%${searchQuery}%` } }
      ]
    };
  }

  try {
    const results = await Result.findAll({ where: whereClause });

    res.status(200).json(results);
  } catch (error) {
    console.error("Error retrieving results:", error);
    res.status(500).json({ error: "Failed to retrieve results." });
  }
};

module.exports = {
  createResult,
  getResultList,
  getResultById,
  updateResult,
  deleteResult,
  getResultByKeyById,
  getResultsByKeyList,
};
