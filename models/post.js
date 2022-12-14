const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      Post.belongsTo(models.UserProfile, {
        foreignKey: 'authorId',
        as: 'author',
      });
      Post.hasMany(models.Comment, {
        foreignKey: 'postId',
        as: 'comments',
        onDelete: 'CASCADE',
      });
      Post.belongsToMany(models.Tag, {
        as: 'tags',
        foreignKey: 'postId',
        through: 'PostTags',
        onDelete: 'CASCADE',
      });
    }
  }

  Post.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    thumbnail: {
      type: DataTypes.STRING,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
    },
    createdAt: {
      type: 'TIMESTAMP',
      defaultValue: new Date(),
      allowNull: false,
    },
    updatedAt: {
      type: 'TIMESTAMP',
      defaultValue: new Date(),
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};
