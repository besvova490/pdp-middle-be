module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn(
      'Posts',
      'description',
      {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    );

    await queryInterface.changeColumn(
      'Posts',
      'thumbnail',
      {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn(
      'Posts',
      'description',
      {
        type: Sequelize.STRING,
        allowNull: false,
      },
    );

    await queryInterface.changeColumn(
      'Posts',
      'thumbnail',
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    );
  },
};
