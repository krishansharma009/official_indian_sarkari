const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/db");
const sanitizeHtml = require('sanitize-html');

class AnswerKey extends Model {}

AnswerKey.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
      set(value) {
        this.setDataValue('content', sanitizeHtml(value, {
          allowedTags: [], // Define your allowed tags as needed
          allowedAttributes: {} // Define your allowed attributes as needed
        }));
      }
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Slug cannot be null'
        }
      }
    },
    metaTags: {
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
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    categories: {
      type: DataTypes.STRING, // Adjust type as per your needs (consider JSON or array type for multiple categories)
      allowNull: true,
    },
    created_by: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    updated_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "AnswerKey", // Ensure model name is in PascalCase
    tableName: "answer_keys", // Correct table name
    timestamps: true,
  }
);

module.exports = AnswerKey;
