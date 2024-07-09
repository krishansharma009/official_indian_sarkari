const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/db");
const sanitizeHtml = require('sanitize-html');

class OldPapers extends Model {}

OldPapers.init(
  {
    postTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shortDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
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
      }
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
    createdBy: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    sequelize,
    modelName: "OldPapers",
    tableName: "old_papers",
    timestamps: true,
  }
);

module.exports = OldPapers;
