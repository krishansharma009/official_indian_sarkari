const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../config/db');
const sanitizeHtml = require('sanitize-html');

class AdmitCard extends Model {}

AdmitCard.init(
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
      type: DataTypes.STRING, // Adjust as necessary, consider JSON or array type if multiple categories
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
    modelName: 'AdmitCard',
    tableName: 'admit_cards', // Adjust table name as per your database setup
    timestamps: true,
  }
);

module.exports = AdmitCard;
