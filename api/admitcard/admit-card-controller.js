const { check, validationResult } = require('express-validator');
const slugify = require('slugify');
const AdmitCard = require('./admit-card'); // Assuming this is your AdmitCard model
const REST_API = require('../../utils/crudHelper'); // Adjust path as necessary
const { Op } = require('sequelize');

// Function to sanitize and slugify the slug field
const sanitizeAndSlugifySlug = (inputSlug) => {
  let slug = inputSlug.trim();
  slug = slug.replace(/\s+/g, ' ');
  slug = slugify(slug, { lower: true });
  return slug;
};

// Create an admit card
const createAdmitCard = [
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
      const admitCard = await AdmitCard.create({ title, content, slug, metaTags, metaDescription, canonicalUrl, created_by, state, categories });
      res.status(200).json(admitCard);
    } catch (error) {
      console.error("Error creating admit card:", error);
      res.status(500).json({ error: "Failed to create admit card." });
    }
  }
];

// Get all admit cards with content-based text search
const getAdmitCardList = async (req, res) => {
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
    const admitCards = await AdmitCard.findAll({ where: whereClause });
    res.status(200).json(admitCards);
  } catch (error) {
    console.error("Error retrieving admit cards:", error);
    res.status(500).json({ error: "Failed to retrieve admit cards." });
  }
};

// Get admit card by ID
const getAdmitCardById = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await REST_API._getDataListById(req, res, AdmitCard, "id", id);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error retrieving admit card:", error);
    res.status(500).json({ error: "Failed to retrieve admit card." });
  }
};

// Update an admit card
const updateAdmitCard = [
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
      const response = await REST_API._update(req, res, AdmitCard);
      res.status(200).json(response);
    } catch (error) {
      console.error("Error updating admit card:", error);
      res.status(500).json({ error: "Failed to update admit card." });
    }
  }
];

// Delete an admit card
const deleteAdmitCard = async (req, res) => {
  try {
    const response = await REST_API._delete(req, res, AdmitCard);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error deleting admit card:", error);
    res.status(500).json({ error: "Failed to delete admit card." });
  }
};

module.exports = {
  createAdmitCard,
  getAdmitCardList,
  getAdmitCardById,
  updateAdmitCard,
  deleteAdmitCard,
};
