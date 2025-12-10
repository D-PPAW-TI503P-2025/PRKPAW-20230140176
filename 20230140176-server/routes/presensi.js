const express = require("express");
const router = express.Router();

const presensiController = require("../controllers/presensiController");
const laporanController = require("../controllers/reportController");

const permissionMiddleware = require("../middleware/permissionMiddleware");
const { authenticateToken } = require("../middleware/permissionMiddleware");

// CHECK-IN
router.post('/check-in', [authenticateToken, presensiController.upload.single('image')], presensiController.CheckIn);

// CHECK-OUT
router.post(
  "/check-out",
  permissionMiddleware.authenticateToken,
  presensiController.CheckOut
);

// UPDATE PRESENSI
router.patch(
  "/:id",
  permissionMiddleware.authenticateToken,
  presensiController.updatePresensi
);

// DELETE PRESENSI
router.delete(
  "/:id",
  permissionMiddleware.authenticateToken,
  presensiController.deletePresensi
);

// LAPORAN HARIAN (ADMIN)
router.get(
  "/laporan",
  permissionMiddleware.authenticateToken,
  permissionMiddleware.isAdmin,
  laporanController.getDailyReport
);

module.exports = router;