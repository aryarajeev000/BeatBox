const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer");
const {
  createSong,
  getAllSongs,
  getSongById,
  updateSong,
  deleteSong,
  getFeaturedSong,
  streamSong
} = require("../controllers/songController");

// ✅ Create Song
router.post(
  "/",
  upload.fields([
    { name: "songImage", maxCount: 1 },
    { name: "audioFile", maxCount: 1 },
  ]),
  createSong
);

// ✅ Featured Song
router.get("/featured", getFeaturedSong);

// ✅ Stream Song
router.get("/stream/:id", streamSong);

// ✅ List All Songs
router.get("/", getAllSongs);

// ✅ Get song by ID
router.get("/:id", getSongById);

// ✅ Update Song
router.put(
  "/:id",
  upload.fields([
    { name: "songImage", maxCount: 1 },
    { name: "audioFile", maxCount: 1 },
  ]),
  updateSong
);

// ✅ Delete Song
router.delete("/:id", deleteSong);

module.exports = router;
