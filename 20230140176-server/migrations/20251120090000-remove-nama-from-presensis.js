"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Hapus kolom nama dari tabel presensis
    return queryInterface.removeColumn("presensis", "nama");
  },

  async down(queryInterface, Sequelize) {
    // Kalau rollback, tambahin lagi kolom nama
    return queryInterface.addColumn("presensis", "nama", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
