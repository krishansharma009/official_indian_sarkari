const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/db");
const sanitizeHtml = require('sanitize-html');

class Blog extends Model {}

Blog.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contentPage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
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
    createdBy: {
      type: DataTypes.STRING,
      allowNull: false,
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
    modelName: "Blog",
    tableName: "blogs",
    timestamps: true,
  }
);

module.exports = Blog;
