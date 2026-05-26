const express = require('express');
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.post('/', protect, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, error: 'No file uploaded' });
  res.json({ success: true, fileUrl: req.file.path, fileType: req.file.mimetype });
});

module.exports = router;