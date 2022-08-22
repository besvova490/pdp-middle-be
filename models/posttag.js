const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PostTag extends Model {

  }
  PostTag.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    postId: DataTypes.INTEGER,
    tagId: DataTypes.INTEGER,
    createdAt: {
      type: 'TIMESTAMP',
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP(3)'),
      allowNull: false,
    },
    updatedAt: {
      type: 'TIMESTAMP',
      defaultValue: sequelize.literal(
        'CURRENT_TIMESTAMP(3)',
      ),
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'PostTag',
  });
  return PostTag;
};
