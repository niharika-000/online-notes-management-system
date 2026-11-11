const express = require("express");
const Note = require("../models/Note");
const auth = require("../middleware/auth");

const router = express.Router();
router.use(auth); // every notes route needs login

// Get notes (optional ?search=word and ?category=Maths)
router.get("/", async (req, res) => {
  const filter = { user: req.userId };
  if (req.query.category) filter.category = req.query.category;
  if (req.query.search) {
    const word = new RegExp(req.query.search, "i");
    filter.$or = [{ title: word }, { content: word }];
  }
  const notes = await Note.find(filter).sort({ updatedAt: -1 });
  res.json(notes);
});

// Add note
router.post("/", async (req, res) => {
  const { title, content, category } = req.body;
  if (!title) return res.status(400).json({ message: "Title is required" });
  const note = await Note.create({
    user: req.userId,
    title,
    content,
    category: category || "General",
  });
  res.json(note);
});

// Edit note
router.put("/:id", async (req, res) => {
  const { title, content, category } = req.body;
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    { title, content, category },
    { new: true }
  );
  if (!note) return res.status(404).json({ message: "Note not found" });
  res.json(note);
});

// Delete note
router.delete("/:id", async (req, res) => {
  await Note.findOneAndDelete({ _id: req.params.id, user: req.userId });
  res.json({ message: "Deleted" });
});

module.exports = router;
