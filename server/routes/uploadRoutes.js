const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

module.exports = function (authenticateToken, requireAdmin) {
  // 1. Single product main image upload
  router.post("/upload", authenticateToken, requireAdmin, (req, res) => {
    upload.single("image")(req, res, (err) => {
      if (err) {
        // Catches Multer filter rejections (e.g. invalid format) or size limits (e.g. >5MB)
        return res.status(400).json({ success: false, error: err.message });
      }
      if (!req.file) {
        return res.status(400).json({ success: false, error: "No file provided!" });
      }
      res.json({
        success: true,
        imageUrl: `/uploads/${req.file.filename}`,
      });
    });
  });

  // 2. Multi-file gallery upload (limit to 10 images at once)
  router.post("/upload-gallery", authenticateToken, requireAdmin, (req, res) => {
    upload.array("gallery", 10)(req, res, (err) => {
      if (err) {
        return res.status(400).json({ success: false, error: err.message });
      }
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ success: false, error: "No files provided!" });
      }
      const imageUrls = req.files.map((file) => `/uploads/${file.filename}`);
      res.json({
        success: true,
        imageUrls: imageUrls,
      });
    });
  });

  return router;
};
