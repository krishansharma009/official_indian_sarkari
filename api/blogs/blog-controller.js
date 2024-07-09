const { check, validationResult } = require('express-validator');
const slugify = require('slugify');
const Blog = require("./blog");
const REST_API = require("../../utils/crudHelper");
const { Op } = require("sequelize");

// Function to sanitize and slugify the slug field
const sanitizeAndSlugifySlug = (inputSlug) => {
  let slug = inputSlug.trim();
  slug = slug.replace(/\s+/g, ' ');
  slug = slugify(slug, { lower: true });
  return slug;
};

// Create a blog with manually entered slug
const createBlog = [
  check('name').notEmpty().withMessage('Name is required'),
  check('title').notEmpty().withMessage('Title is required'),
  check('slug').notEmpty().withMessage('Slug is required'),
  check('createdBy').notEmpty().withMessage('Created by is required'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { name, title, category, contentPage, image, content, metaTitle, metaDescription, canonicalUrl, slug, createdBy } = req.body;
    slug = sanitizeAndSlugifySlug(slug);

    try {
      const blog = await Blog.create({ name, title, category, contentPage, image, content, metaTitle, metaDescription, canonicalUrl, slug, createdBy });
      res.status(200).json(blog);
    } catch (error) {
      console.error("Error creating blog:", error);
      res.status(500).json({ error: "Failed to create blog." });
    }
  }
];

// Get all blogs with content-based text search
const getBlogList = async (req, res) => {
  const { searchQuery } = req.query;
  let whereClause = {};

  if (searchQuery) {
    whereClause = {
      [Op.or]: [
        { name: { [Op.like]: `%${searchQuery}%` } },
        { title: { [Op.like]: `%${searchQuery}%` } },
        { content: { [Op.like]: `%${searchQuery}%` } }
      ]
    };
  }

  try {
    const blogs = await Blog.findAll({ where: whereClause });
    res.status(200).json(blogs);
  } catch (error) {
    console.error("Error retrieving blogs:", error);
    res.status(500).json({ error: "Failed to retrieve blogs." });
  }
};

// Get blog by ID
const getBlogById = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await REST_API._getDataListById(req, res, Blog, "id", id);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error retrieving blog:", error);
    res.status(500).json({ error: "Failed to retrieve blog." });
  }
};

// Update a blog
const updateBlog = [
  check('name').notEmpty().withMessage('Name is required'),
  check('title').notEmpty().withMessage('Title is required'),
  check('slug').notEmpty().withMessage('Slug is required'),
  check('createdBy').notEmpty().withMessage('Created by is required'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { name, title, category, contentPage, image, content, metaTitle, metaDescription, canonicalUrl, slug, createdBy } = req.body;
    slug = sanitizeAndSlugifySlug(slug);

    try {
      const response = await REST_API._update(req, res, Blog);
      res.status(200).json(response);
    } catch (error) {
      console.error("Error updating blog:", error);
      res.status(500).json({ error: "Failed to update blog." });
    }
  }
];

// Delete a blog
const deleteBlog = async (req, res) => {
  try {
    const response = await REST_API._delete(req, res, Blog);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ error: "Failed to delete blog." });
  }
};

module.exports = {
  createBlog,
  getBlogList,
  getBlogById,
  updateBlog,
  deleteBlog,
};
