const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/db");
const sanitizeHtml = require('sanitize-html');
const slugify = require('slugify');

class Book extends Model {}

Book.init(
  {
    nameOfBook: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    shortDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
      set(value) {
        // Setter to sanitize shortDescription using sanitize-html
        const sanitizedValue = sanitizeHtml(value, {
          allowedTags: [], // No tags allowed, only plain text
          allowedAttributes: {} // No attributes allowed
        });
        this.setDataValue('shortDescription', sanitizedValue);
      }
    },
    pdf: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    metaTitle: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    metaDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    canonicalUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Slug cannot be null'
        }
      },
      set(value) {
        // Setter to sanitize and slugify the slug field
        let slug = value.trim();
        slug = slugify(slug, { lower: true });
        this.setDataValue('slug', slug);
      }
    },
    created_by: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    updated_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Book",
    tableName: "books",
    timestamps: true,
  }
);

module.exports = Book;
