module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'UserProfiles',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        avatar: {
          type: Sequelize.STRING,
        },
        thumbnailImage: {
          type: Sequelize.STRING,
        },
        userName: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        fullName: {
          type: Sequelize.STRING,
        },
        description: {
          type: Sequelize.STRING,
        },
        address: {
          type: Sequelize.STRING,
        },
        phone: {
          type: Sequelize.STRING,
        },
        createdAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
        },
        updatedAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
        },
      },
      {
        onDelete: 'CASCADE',
        timestamps: true,
      },
    );

    await queryInterface.addColumn(
      'Users',
      'UserProfileId',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'UserProfiles',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
    );
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Users', 'UserProfileId');
    await queryInterface.dropTable('UserProfiles');
  },
};
