const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserProfile extends Model {
    static associate(models) {
      UserProfile.hasMany(models.Comment, {
        foreignKey: 'id',
        onDelete: 'CASCADE',
      });
      UserProfile.hasOne(models.User, {
        foreignKey: 'id',
        onDelete: 'CASCADE',
      });
      UserProfile.hasMany(models.Post, {
        onDelete: 'CASCADE',
        foreignKey: 'id',
      });
      UserProfile.hasMany(models.Chat, {
        onDelete: 'CASCADE',
        foreignKey: 'id',
        as: 'chats',
      });
    }
  }

  UserProfile.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    avatar: DataTypes.STRING,
    thumbnailImage: DataTypes.STRING,
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    fullName: DataTypes.STRING,
    description: DataTypes.STRING,
    address: DataTypes.STRING,
    phone: DataTypes.STRING,
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
    modelName: 'UserProfile',
  });
  return UserProfile;
};
