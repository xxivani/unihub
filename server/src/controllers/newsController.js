// server/src/controllers/newsController.js
const { NewsPost } = require('../models');
const multer = require('multer');
const path = require('path');

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "image") {
      cb(null, 'uploads/images/');
    } else if (file.fieldname === "pdf") {
      cb(null, 'uploads/pdfs/');
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage: storage });

const createNewsPost = async (req, res) => {
  try {
    const { title, body } = req.body;
    const thumbnailImage = req.files && req.files.image
      ? `/uploads/images/${req.files.image[0].filename}`
      : '/assets/images/stock-news.jpeg';
    
    if (!req.files || !req.files.pdf || req.files.pdf.length === 0) {
      return res.status(400).json({ error: "Newsletter PDF is required." });
    }
    const newsletterPdf = `/uploads/pdfs/${req.files.pdf[0].filename}`;

    const newsPost = await NewsPost.create({ title, body, thumbnailImage, newsletterPdf });
    res.status(201).json({ message: "News post created", newsPost });
  } catch (error) {
    console.error("Error creating news post:", error);
    res.status(500).json({ error: error.message });
  }
};

const getAllNewsPosts = async (req, res) => {
  try {
    const newsPosts = await NewsPost.findAll({ order: [['createdAt', 'DESC']] });
    res.json(newsPosts);
  } catch (error) {
    console.error("Error fetching news posts:", error);
    res.status(500).json({ error: error.message });
  }
};

const downloadNewsletter = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await NewsPost.findByPk(id);
    if (!news || !news.newsletterPdf) {
      return res.status(404).json({ error: "PDF not found" });
    }
    // Construct the absolute file path. Adjust the path if your folder structure differs.
    const filePath = path.join(__dirname, "..", "uploads", "pdfs", path.basename(news.newsletterPdf));
    res.download(filePath, path.basename(filePath), (err) => {
      if (err) {
        console.error("Download error:", err);
        return res.status(500).json({ error: "File download failed" });
      }
    });
  } catch (error) {
    console.error("Error in downloadNewsletter:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createNewsPost,
  getAllNewsPosts,
  upload,         
  downloadNewsletter,
};
