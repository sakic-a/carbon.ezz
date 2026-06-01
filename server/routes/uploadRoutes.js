const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const authenticateToken = require("../middleware/authenticateToken");
const requireAdmin = require("../middleware/requireAdmin");

router.post(
  "/upload",
  authenticateToken,
  requireAdmin,
  upload.single("image"),
  (req, res) => {
    res.json({
      success: true,
      imageUrl: `/uploads/${req.file.filename}`,
    });
  }
);

module.exports = router;