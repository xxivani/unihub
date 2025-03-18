const { News } = require('../models');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath;
    if (file.fieldname === 'image') {
      uploadPath = path.join(__dirname, '../uploads/images/');
    } else if (file.fieldname === 'pdf') {
      uploadPath = path.join(__dirname, '../uploads/pdfs/');
    }
    
    
    fs.mkdirSync(uploadPath, { recursive: true });
    
    console.log(`Saving ${file.fieldname} to: ${uploadPath}`);
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
    console.log(`Generated filename: ${filename}`);
    cb(null, filename);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    if (file.fieldname === 'image') {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
      }
    } else if (file.fieldname === 'pdf') {
      if (!file.originalname.match(/\.(pdf)$/)) {
        return cb(new Error('Only PDF files are allowed!'), false);
      }
    }
    cb(null, true);
  }
});

// Create a news post
const createNewsPost = async (req, res) => {
  try {
    const { title, body } = req.body;
    const user = req.user || { user_name: 'Admin' }; 
    if (!title || !body) {
      return res.status(400).json({ message: 'Title and body are required' });
    }

    if (!req.files?.pdf) {
      return res.status(400).json({ message: 'PDF file is required' });
    }
    
    console.log('PDF file details:', req.files.pdf[0]);
    
    const pdfFilename = path.basename(req.files.pdf[0].path);
    const imageFilename = req.files?.image ? path.basename(req.files.image[0].path) : null;
    
    const pdfUrl = `/uploads/pdfs/${pdfFilename}`;
    const imageUrl = imageFilename ? `/uploads/images/${imageFilename}` : null;
    
    console.log('Storing PDF URL as:', pdfUrl);
    
    const newsPost = await News.create({
      news_title: title,
      news_content: body,
      news_author: user.user_name,
      news_created_at: new Date(),
      news_thumbnail_url: imageUrl,
      news_pdf_url: pdfUrl
    });
    
    res.status(201).json({ 
      message: 'News post created successfully',
      newsPost
    });
  } catch (error) {
    console.error('Error creating news post:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllNewsPosts = async (req, res) => {
  try {
    const newsPosts = await News.findAll({
      order: [['news_created_at', 'DESC']]
    });
    
    res.status(200).json(newsPosts);
  } catch (error) {
    console.error('Error fetching news posts:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getNewsPostById = async (req, res) => {
  try {
    const newsId = req.params.id;
    const newsPost = await News.findByPk(newsId);
    
    if (!newsPost) {
      return res.status(404).json({ message: 'News post not found' });
    }
    
    res.status(200).json(newsPost);
  } catch (error) {
    console.error('Error fetching news post:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a news post
const updateNewsPost = async (req, res) => {
  try {
    const newsId = req.params.id;
    const { title, body } = req.body;
    
    // Find the news post
    const newsPost = await News.findByPk(newsId);
    
    if (!newsPost) {
      return res.status(404).json({ message: 'News post not found' });
    }
    
    const updateData = {
      news_title: title || newsPost.news_title,
      news_content: body || newsPost.news_content,
    };
    
    if (req.files?.image) {
      updateData.news_thumbnail_url = `/uploads/images/${path.basename(req.files.image[0].path)}`;
    }
    
    if (req.files?.pdf) {
      updateData.news_pdf_url = `/uploads/pdfs/${path.basename(req.files.pdf[0].path)}`;
    }
    
    await newsPost.update(updateData);
    
    res.status(200).json({ 
      message: 'News post updated successfully',
      newsPost
    });
  } catch (error) {
    console.error('Error updating news post:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a news post
const deleteNewsPost = async (req, res) => {
  try {
    const newsId = req.params.id;
    const newsPost = await News.findByPk(newsId);
    
    if (!newsPost) {
      return res.status(404).json({ message: 'News post not found' });
    }
    
    // Come back to this for deleting the pdf/images associated with a news post when you delete a news post

    await newsPost.destroy();
    
    res.status(200).json({ message: 'News post deleted successfully' });
  } catch (error) {
    console.error('Error deleting news post:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createNewsPost,
  getAllNewsPosts,
  getNewsPostById,
  updateNewsPost,
  deleteNewsPost,
  upload
};
