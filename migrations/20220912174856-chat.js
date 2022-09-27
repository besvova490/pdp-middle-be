module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'Chats',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        initiatorId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'UserProfiles',
            key: 'id',
          },
          onDelete: 'CASCADE',
        },
        receiverId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'UserProfiles',
            key: 'id',
          },
          onDelete: 'CASCADE',
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
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Chats');
  },
};
