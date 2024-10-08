const { check, validationResult } = require('express-validator');
const slugify = require('slugify');
const JobPost = require("./job-post");
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

// Create a job post with manually entered slug
const createJobPost = [
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
      const jobPost = await JobPost.create({ title, content, slug, metaTags, metaDescription, canonicalUrl, created_by, state, categories });
      res.status(200).json(jobPost);
    } catch (error) {
      console.error("Error creating job post:", error);
      res.status(500).json({ error: "Failed to create job post." });
    }
  }
];

// Get all job posts with content-based text search
const getJobPostList = async (req, res) => {
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
    const jobPosts = await JobPost.findAll({ where: whereClause });

    res.status(200).json(jobPosts);
  } catch (error) {
    console.error("Error retrieving job posts:", error);
    res.status(500).json({ error: "Failed to retrieve job posts." });
  }
};

// Get job post by ID
const getJobPostById = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await REST_API._getDataListById(req, res, JobPost, "id", id);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error retrieving job post:", error);
    res.status(500).json({ error: "Failed to retrieve job post." });
  }
};

// Update a job post
const updateJobPost = [
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
      const response = await REST_API._update(req, res, JobPost);
      res.status(200).json(response);
    } catch (error) {
      console.error("Error updating job post:", error);
      res.status(500).json({ error: "Failed to update job post." });
    }
  }
];

// Delete a job post
const deleteJobPost = async (req, res) => {
  try {
    const response = await REST_API._delete(req, res, JobPost);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error deleting job post:", error);
    res.status(500).json({ error: "Failed to delete job post." });
  }
};

module.exports = {
  createJobPost,
  getJobPostList,
  getJobPostById,
  updateJobPost,
  deleteJobPost,
};
