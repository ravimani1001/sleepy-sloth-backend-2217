const express = require("express");
const router = express.Router();
const {
  uploadChapters,
  getChapterById,
  getChapters,
} = require("../controllers/chapter.controller");
const { protect, isAdmin } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const uploadMiddleware = require("../middleware/uploadWrapper.middleware");
const rateLimiter = require("../middleware/rateLimiter.middleware");

// POST /api/vi/chapters - for uploading JSON file having array of chapters
router.post(
  "/",
  protect,
  isAdmin,
  uploadMiddleware, //wrapper to the upload.middleware
  uploadChapters
);

// GET /api/v1/chapters/:id - to get a chapter using its ID
router.get("/:id", protect, getChapterById);

// GET /api/v1/chapters - to get all chapters with filters and pagination
router.get("/", protect, getChapters);

module.exports = router;
