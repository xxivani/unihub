const { News } = require('../models');
const path = require('path');
const fs = require('fs');
const { upload } = require('../middleware/upload'); 

try {
  console.log('Database connection details:', db.sequelize.config);
  
  const tableCheck = await News.sequelize.query('SELECT to_regclass(\'public.news\');');
  console.log('Table check result:', tableCheck);
  

  const createNewsPost = async (req, res) => {
    try {
      console.log('Creating news post with body:', req.body);
      console.log('Files received:', req.files);
      
      const { title, body } = req.body;
      const user = req.user || { user_name: 'Admin' }; 
      
      if (!title || !body) {
        return res.status(400).json({ message: 'Title and body are required' });
      }

      if (!req.files?.pdf) {
        return res.status(400).json({ message: 'PDF file is required' });
      }
      
      console.log('PDF file details:', req.files.pdf[0]);
      
      const pdfFilename = req.files.pdf[0].filename;
      const imageFilename = req.files?.image ? req.files.image[0].filename : null;
      
      const pdfUrl = `/uploads/pdfs/${pdfFilename}`;
      const imageUrl = imageFilename ? `/uploads/images/${imageFilename}` : null;
      
      console.log('Storing PDF URL as:', pdfUrl);
      console.log('Storing image URL as:', imageUrl);
      
      if (req.files.pdf[0].path) {
        const pdfPath = req.files.pdf[0].path;
        console.log('Checking if PDF exists at path:', pdfPath);
        console.log('File exists:', fs.existsSync(pdfPath));
      }
      
      const newsPost = await News.create({
        news_title: title,
        news_content: body,
        news_author: user.user_name,
        news_created_at: new Date(),
        news_thumbnail_url: imageUrl || '/uploads/images/default.jpg', 
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

} catch (error) {
  console.error('Error creating news post:', error);
  console.error('Error stack:', error.stack);
  console.error('Current DB connection:', {
    database: News.sequelize.config.database,
    username: News.sequelize.config.username,
    host: News.sequelize.config.host,
    port: News.sequelize.config.port
  });
  res.status(500).json({ message: 'Server error', error: error.message });
}

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
    
    // Delete the associated files
    if (newsPost.news_pdf_url) {
      const pdfPath = path.join(__dirname, '../../', newsPost.news_pdf_url);
      if (fs.existsSync(pdfPath)) {
        fs.unlinkSync(pdfPath);
      }
    }
    
    if (newsPost.news_thumbnail_url) {
      const imagePath = path.join(__dirname, '../../', newsPost.news_thumbnail_url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

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