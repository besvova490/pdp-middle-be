const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    static associate(models) {
      Chat.belongsTo(models.UserProfile, {
        foreignKey: 'initiatorId',
        as: 'initiator',
      });
      Chat.belongsTo(models.UserProfile, {
        foreignKey: 'receiverId',
        as: 'receiver',
      });
    }
  }

  Chat.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
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
    modelName: 'Chat',
  });
  return Chat;
};
