const { check, validationResult } = require('express-validator');
const slugify = require('slugify');
const AnswerKey = require("./answer-key"); // Replace with your AnswerKey model
const REST_API = require("../../utils/crudHelper"); // Adjust path if necessary
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

// Create an answer key
const createAnswerKey = [
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
      const answerKey = await AnswerKey.create({ title, content, slug, metaTags, metaDescription, canonicalUrl, created_by, state, categories });
      res.status(200).json(answerKey);
    } catch (error) {
      console.error("Error creating answer key:", error);
      res.status(500).json({ error: "Failed to create answer key." });
    }
  }
];

// Get all answer keys with content-based text search
const getAnswerKeyList = async (req, res) => {
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
    const answerKeys = await AnswerKey.findAll({ where: whereClause });

    res.status(200).json(answerKeys);
  } catch (error) {
    console.error("Error retrieving answer keys:", error);
    res.status(500).json({ error: "Failed to retrieve answer keys." });
  }
};

// Get answer key by ID
const getAnswerKeyById = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await REST_API._getDataListById(req, res, AnswerKey, "id", id);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error retrieving answer key:", error);
    res.status(500).json({ error: "Failed to retrieve answer key." });
  }
};

// Update an answer key
const updateAnswerKey = [
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
      const response = await REST_API._update(req, res, AnswerKey);
      res.status(200).json(response);
    } catch (error) {
      console.error("Error updating answer key:", error);
      res.status(500).json({ error: "Failed to update answer key." });
    }
  }
];

// Delete an answer key
const deleteAnswerKey = async (req, res) => {
  try {
    const response = await REST_API._delete(req, res, AnswerKey);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error deleting answer key:", error);
    res.status(500).json({ error: "Failed to delete answer key." });
  }
};

module.exports = {
  createAnswerKey,
  getAnswerKeyList,
  getAnswerKeyById,
  updateAnswerKey,
  deleteAnswerKey,
};
