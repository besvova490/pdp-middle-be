const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    static associate(models) {
      Tag.belongsToMany(models.Post, {
        as: 'posts',
        through: 'PostTags',
        foreignKey: 'tagId',
        onDelete: 'CASCADE',
      });
    }
  }
  Tag.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
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
    modelName: 'Tag',
  });
  return Tag;
};
