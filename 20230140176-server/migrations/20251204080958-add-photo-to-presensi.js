'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Tambah kolom buktiFoto ke tabel presensis
    await queryInterface.addColumn('presensis', 'buktiFoto', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Kalau di-rollback, hapus lagi kolom buktiFoto
    await queryInterface.removeColumn('presensis', 'buktiFoto');
  }
};
