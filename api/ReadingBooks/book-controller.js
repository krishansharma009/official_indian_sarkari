const { check, validationResult } = require('express-validator');
const slugify = require('slugify');
const Book = require("./book");
const REST_API = require("../../utils/crudHelper");
const { Op } = require("sequelize");
const sanitizeHtml = require('sanitize-html');

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

// Function to sanitize HTML in shortDescription field
const sanitizeShortDescription = (inputDescription) => {
  return sanitizeHtml(inputDescription, {
    allowedTags: [], // No tags allowed, only plain text
    allowedAttributes: {}, // No attributes allowed
  });
};

// Create a book with manually entered slug
const createBook = [
  // Validation middleware
  check('nameOfBook').notEmpty().withMessage('Name of the book is required'),
  check('slug').notEmpty().withMessage('Slug is required'),
  check('createdBy').notEmpty().withMessage('Created by is required'),

  // Request handler
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { nameOfBook, category, subject, shortDescription, pdf, metaTitle, metaDescription, canonicalUrl, slug, createdBy } = req.body;

    // Sanitize and slugify the slug field
    slug = sanitizeAndSlugifySlug(slug);

    // Sanitize shortDescription
    shortDescription = sanitizeShortDescription(shortDescription);

    try {
      const book = await Book.create({ nameOfBook, category, subject, shortDescription, pdf, metaTitle, metaDescription, canonicalUrl, slug, createdBy });
      res.status(200).json(book);
    } catch (error) {
      console.error("Error creating book:", error);
      res.status(500).json({ error: "Failed to create book." });
    }
  }
];

// Get all books with content-based text search
const getBookList = async (req, res) => {
  const { searchQuery } = req.query;
  let whereClause = {};

  if (searchQuery) {
    whereClause = {
      [Op.or]: [
        { nameOfBook: { [Op.like]: `%${searchQuery}%` } },
        { shortDescription: { [Op.like]: `%${searchQuery}%` } }
      ]
    };
  }

  try {
    const books = await Book.findAll({ where: whereClause });
    res.status(200).json(books);
  } catch (error) {
    console.error("Error retrieving books:", error);
    res.status(500).json({ error: "Failed to retrieve books." });
  }
};

// Get book by ID
const getBookById = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await REST_API._getDataListById(req, res, Book, "id", id);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error retrieving book:", error);
    res.status(500).json({ error: "Failed to retrieve book." });
  }
};

// Update a book
const updateBook = [
  check('nameOfBook').notEmpty().withMessage('Name of the book is required'),
  check('slug').notEmpty().withMessage('Slug is required'),
  check('createdBy').notEmpty().withMessage('Created by is required'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { nameOfBook, category, subject, shortDescription, pdf, metaTitle, metaDescription, canonicalUrl, slug, createdBy } = req.body;

    // Sanitize and slugify the slug field
    slug = sanitizeAndSlugifySlug(slug);

    // Sanitize shortDescription
    shortDescription = sanitizeShortDescription(shortDescription);

    try {
      const response = await REST_API._update(req, res, Book);
      res.status(200).json(response);
    } catch (error) {
      console.error("Error updating book:", error);
      res.status(500).json({ error: "Failed to update book." });
    }
  }
];

// Delete a book
const deleteBook = async (req, res) => {
  try {
    const response = await REST_API._delete(req, res, Book);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ error: "Failed to delete book." });
  }
};

module.exports = {
  createBook,
  getBookList,
  getBookById,
  updateBook,
  deleteBook,
};
