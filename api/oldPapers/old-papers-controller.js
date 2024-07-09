const { check, validationResult } = require('express-validator');
const slugify = require('slugify');
const OldPapers = require("./old-papers");
const REST_API = require("../../utils/crudHelper");
const { Op } = require("sequelize");

// Function to sanitize and slugify the slug field
const sanitizeAndSlugifySlug = (inputSlug) => {
  let slug = inputSlug.trim();
  slug = slug.replace(/\s+/g, ' ');
  slug = slugify(slug, { lower: true });
  return slug;
};

// Create a paper with manually entered slug
const createOldPaper = [
  check('postTitle').notEmpty().withMessage('Post title is required'),
  check('category').notEmpty().withMessage('Category is required'),
  check('subject').notEmpty().withMessage('Subject is required'),
  check('slug').notEmpty().withMessage('Slug is required'),
  check('createdBy').notEmpty().withMessage('Created by is required'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { postTitle, category, subject, shortDescription, pdf, metaTitle, metaDescription, canonicalUrl, slug, createdBy } = req.body;
    slug = sanitizeAndSlugifySlug(slug);

    try {
      const oldPaper = await OldPapers.create({ postTitle, category, subject, shortDescription, pdf, metaTitle, metaDescription, canonicalUrl, slug, createdBy });
      res.status(200).json(oldPaper);
    } catch (error) {
      console.error("Error creating old paper:", error);
      res.status(500).json({ error: "Failed to create old paper." });
    }
  }
];

// Get all old papers with content-based text search
const getOldPapersList = async (req, res) => {
  const { searchQuery } = req.query;
  let whereClause = {};

  if (searchQuery) {
    whereClause = {
      [Op.or]: [
        { postTitle: { [Op.like]: `%${searchQuery}%` } },
        { shortDescription: { [Op.like]: `%${searchQuery}%` } }
      ]
    };
  }

  try {
    const oldPapers = await OldPapers.findAll({ where: whereClause });
    res.status(200).json(oldPapers);
  } catch (error) {
    console.error("Error retrieving old papers:", error);
    res.status(500).json({ error: "Failed to retrieve old papers." });
  }
};

// Get old paper by ID
const getOldPaperById = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await REST_API._getDataListById(req, res, OldPapers, "id", id);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error retrieving old paper:", error);
    res.status(500).json({ error: "Failed to retrieve old paper." });
  }
};

// Update an old paper
const updateOldPaper = [
  check('postTitle').notEmpty().withMessage('Post title is required'),
  check('category').notEmpty().withMessage('Category is required'),
  check('subject').notEmpty().withMessage('Subject is required'),
  check('slug').notEmpty().withMessage('Slug is required'),
  check('createdBy').notEmpty().withMessage('Created by is required'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { postTitle, category, subject, shortDescription, pdf, metaTitle, metaDescription, canonicalUrl, slug, createdBy } = req.body;
    slug = sanitizeAndSlugifySlug(slug);

    try {
      const response = await REST_API._update(req, res, OldPapers);
      res.status(200).json(response);
    } catch (error) {
      console.error("Error updating old paper:", error);
      res.status(500).json({ error: "Failed to update old paper." });
    }
  }
];

// Delete an old paper
const deleteOldPaper = async (req, res) => {
  try {
    const response = await REST_API._delete(req, res, OldPapers);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error deleting old paper:", error);
    res.status(500).json({ error: "Failed to delete old paper." });
  }
};

module.exports = {
  createOldPaper,
  getOldPapersList,
  getOldPaperById,
  updateOldPaper,
  deleteOldPaper,
};
