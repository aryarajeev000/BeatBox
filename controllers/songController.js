const Song = require("../models/songModel");
const fs = require("fs");
const path = require("path");

// CREATE
exports.createSong = async (req, res) => {
  try {
    const { songName, description, action } = req.body;

    const songImage = req.files?.songImage?.[0]?.filename;
    const audioFile = req.files?.audioFile?.[0]?.filename;

    if (!songImage || !audioFile) {
      return res.status(400).json({ message: "Song image and audio file are required" });
    }

    const audioStream = `${req.protocol}://${req.get("host")}/uploads/songs/${audioFile}`;

    const song = new Song({
      songName,
      songImage,
      description,
      audioFile,
      audioStream,
      action
    });

    await song.save();
    res.status(201).json({ message: "Song created successfully", song });
  } catch (error) {
    res.status(500).json({ message: "Error creating song", error });
  }
};

// GET ALL
exports.getAllSongs = async (req, res) => {
  try {
    const songs = await Song.find();
    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching songs", error });
  }
};

// GET ONE
exports.getSongById = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: "Song not found" });
    res.status(200).json(song);
  } catch (error) {
    res.status(500).json({ message: "Error fetching song", error });
  }
};

// STREAM ENDPOINT
exports.streamSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: "Song not found" });

    const audioPath = path.join(__dirname, "..", "uploads", "songs", song.audioFile);

    if (!fs.existsSync(audioPath)) {
      return res.status(404).json({ message: "Audio file not found" });
    }

    const stat = fs.statSync(audioPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;
      const file = fs.createReadStream(audioPath, { start, end });
      const head = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "audio/mpeg",
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        "Content-Length": fileSize,
        "Content-Type": "audio/mpeg",
      };
      res.writeHead(200, head);
      fs.createReadStream(audioPath).pipe(res);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error streaming song" });
  }
};

// UPDATE
exports.updateSong = async (req, res) => {
  try {
    const { songName, description, action } = req.body;
    const song = await Song.findById(req.params.id);

    if (!song) return res.status(404).json({ message: "Song not found" });

    if (req.files?.songImage?.[0]?.filename) {
      song.songImage = req.files.songImage[0].filename;
    }
    if (req.files?.audioFile?.[0]?.filename) {
      song.audioFile = req.files.audioFile[0].filename;
      song.audioStream = `${req.protocol}://${req.get("host")}/uploads/songs/${song.audioFile}`;
    }

    song.songName = songName || song.songName;
    song.description = description || song.description;
    song.action = action || song.action;

    await song.save();
    res.status(200).json({ message: "Song updated", song });
  } catch (error) {
    res.status(500).json({ message: "Error updating song", error });
  }
};

// DELETE
exports.deleteSong = async (req, res) => {
  try {
    const song = await Song.findByIdAndDelete(req.params.id);
    if (!song) return res.status(404).json({ message: "Song not found" });

    // delete files from disk
    const imagePath = path.join(__dirname, "..", "uploads", "songs", song.songImage);
    const audioPath = path.join(__dirname, "..", "uploads", "songs", song.audioFile);

    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);

    res.status(200).json({ message: "Song deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting song", error });
  }
};

// GET FEATURED
exports.getFeaturedSong = async (req, res) => {
  try {
    let featuredSong = await Song.findOne({ isFeatured: true });

    if (!featuredSong) {
      featuredSong = await Song.findOne().sort({ createdAt: -1 });
    }

    if (!featuredSong) {
      return res.status(404).json({ message: "No songs available" });
    }

    res.status(200).json(featuredSong);
  } catch (error) {
    res.status(500).json({ message: "Error fetching featured song" });
  }
};
