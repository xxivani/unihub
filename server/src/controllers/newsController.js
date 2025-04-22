const { News } = require('../models');
const path = require('path');
const fs = require('fs');
const { upload } = require('../middleware/upload'); 

const checkDatabaseConnection = async () => {
  try {
    if (!News || !News.sequelize) {
      console.error('News model or sequelize connection not available');
      return false;
    }
    
    console.log('Database connection details:', {
      database: News.sequelize.config.database,
      username: News.sequelize.config.username,
      host: News.sequelize.config.host,
      port: News.sequelize.config.port
    });
    
    const tableCheck = await News.sequelize.query('SELECT to_regclass(\'public.news\');');
    console.log('Table check result:', tableCheck);
    
    return true;
  } catch (error) {
    console.error('Error checking database connection:', error);
    console.error('Error stack:', error.stack);
    if (News && News.sequelize && News.sequelize.config) {
      console.error('Current DB connection:', {
        database: News.sequelize.config.database,
        username: News.sequelize.config.username,
        host: News.sequelize.config.host,
        port: News.sequelize.config.port
      });
    }
    return false;
  }
};

let lastNewsUpdate = Date.now();
const updateLastModified = () => {
  lastNewsUpdate = Date.now();
  console.log(`News data modified at ${new Date(lastNewsUpdate).toISOString()}`);
};

const getLastModified = (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.status(200).json({ lastModified: lastNewsUpdate });
};

const createNewsPost = async (req, res) => {
  const transaction = await News.sequelize.transaction();
  
  try {
    console.log('Creating news post with body:', req.body);
    console.log('Files received:', req.files);
    
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      console.error('Database connection check failed before creating news post');
      return res.status(500).json({ message: 'Database connection error' });
    }
    
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
    
    try {
      const newsPost = await News.create({
        news_title: title,
        news_content: body,
        news_author: user.user_name,
        news_created_at: new Date(),
        news_thumbnail_url: imageUrl || '/uploads/images/default.jpg', 
        news_pdf_url: pdfUrl
      }, { transaction });
      
      await transaction.commit();
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const verifyPost = await News.findByPk(newsPost.news_id);
      if (verifyPost) {
        console.log(`Verification: Post ${newsPost.news_id} successfully created and found in database`);
      } else {
        console.warn(`Verification: Post ${newsPost.news_id} was created but not found in subsequent query`);
      }
      
      updateLastModified();
      
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      
      res.status(201).json({ 
        message: 'News post created successfully',
        newsPost,
        lastModified: lastNewsUpdate
      });
    } catch (insertError) {
      await transaction.rollback();
      
      console.error('Error using model create, trying raw query:', insertError);
      
      const rawTransaction = await News.sequelize.transaction();
      
      try {
        const rawInsert = await News.sequelize.query(
          `INSERT INTO news (news_title, news_content, news_author, news_created_at, news_thumbnail_url, news_pdf_url) 
           VALUES (:title, :body, :author, :created_at, :thumbnail, :pdf) RETURNING *`,
          {
            replacements: {
              title,
              body,
              author: user.user_name,
              created_at: new Date(),
              thumbnail: imageUrl || '/uploads/images/default.jpg',
              pdf: pdfUrl
            },
            type: News.sequelize.QueryTypes.INSERT,
            transaction: rawTransaction
          }
        );
        
        await rawTransaction.commit();
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        updateLastModified();
        
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        
        res.status(201).json({ 
          message: 'News post created successfully using raw query',
          newsPost: rawInsert[0][0],
          lastModified: lastNewsUpdate
        });
      } catch (rawError) {
        await rawTransaction.rollback();
        throw rawError;
      }
    }
  } catch (error) {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }
    
    console.error('Error creating news post:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllNewsPosts = async (req, res) => {
  try {
    console.log('Fetching all news posts');
    
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      console.error('Database connection check failed before fetching news posts');
      return res.status(500).json({ message: 'Database connection error' });
    }
    
    try {
      const newsPosts = await News.findAll({
        order: [['news_created_at', 'DESC']]
      });
      
      console.log(`Retrieved ${newsPosts.length} news posts`);
      
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      
      res.status(200).json(newsPosts);
    } catch (modelError) {
      console.error('Error using model findAll, trying raw query:', modelError);
      
      const rawQuery = await News.sequelize.query(
        `SELECT news_id, news_title, news_content, news_created_at, news_thumbnail_url, news_author, news_pdf_url 
         FROM public.news 
         ORDER BY news_created_at DESC`,
        {
          type: News.sequelize.QueryTypes.SELECT
        }
      );
      
      console.log(`Retrieved ${rawQuery.length} news posts via raw query`);
      
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      
      res.status(200).json(rawQuery);
    }
  } catch (error) {
    console.error('Error fetching news posts:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getNewsPostById = async (req, res) => {
  try {
    const newsId = req.params.id;
    console.log(`Fetching news post with ID: ${newsId}`);
    
    try {
      const newsPost = await News.findByPk(newsId);
      
      if (!newsPost) {
        return res.status(404).json({ message: 'News post not found' });
      }
      
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      
      res.status(200).json(newsPost);
    } catch (modelError) {
      console.error('Error using model findByPk, trying raw query:', modelError);
      
      const rawQuery = await News.sequelize.query(
        `SELECT news_id, news_title, news_content, news_created_at, news_thumbnail_url, news_author, news_pdf_url 
         FROM public.news 
         WHERE news_id = :newsId`,
        {
          replacements: { newsId },
          type: News.sequelize.QueryTypes.SELECT
        }
      );
      
      if (!rawQuery.length) {
        return res.status(404).json({ message: 'News post not found' });
      }
      
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      
      res.status(200).json(rawQuery[0]);
    }
  } catch (error) {
    console.error('Error fetching news post:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateNewsPost = async (req, res) => {
  const transaction = await News.sequelize.transaction();
  
  try {
    const newsId = req.params.id;
    const { title, body } = req.body;
    
    try {
      const newsPost = await News.findByPk(newsId, { transaction });
      
      if (!newsPost) {
        await transaction.rollback();
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
      
      await newsPost.update(updateData, { transaction });
      
      await transaction.commit();
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      updateLastModified();
      
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      
      res.status(200).json({ 
        message: 'News post updated successfully',
        newsPost,
        lastModified: lastNewsUpdate
      });
    } catch (modelError) {
      await transaction.rollback();
      
      console.error('Error using model update, trying raw query:', modelError);
      
      const rawTransaction = await News.sequelize.transaction();
      
      try {
        const updates = [];
        const replacements = { newsId };
        
        if (title) {
          updates.push('news_title = :title');
          replacements.title = title;
        }
        
        if (body) {
          updates.push('news_content = :body');
          replacements.body = body;
        }
        
        if (req.files?.image) {
          updates.push('news_thumbnail_url = :image');
          replacements.image = `/uploads/images/${path.basename(req.files.image[0].path)}`;
        }
        
        if (req.files?.pdf) {
          updates.push('news_pdf_url = :pdf');
          replacements.pdf = `/uploads/pdfs/${path.basename(req.files.pdf[0].path)}`;
        }
        
        if (updates.length === 0) {
          await rawTransaction.rollback();
          return res.status(400).json({ message: 'No fields to update' });
        }
        
        const updateQuery = `
          UPDATE public.news
          SET ${updates.join(', ')}
          WHERE news_id = :newsId
          RETURNING *
        `;
        
        const result = await News.sequelize.query(updateQuery, {
          replacements,
          type: News.sequelize.QueryTypes.UPDATE,
          transaction: rawTransaction
        });
        
        if (!result[1].rowCount || result[1].rowCount === 0) {
          await rawTransaction.rollback();
          return res.status(404).json({ message: 'News post not found' });
        }
        
        await rawTransaction.commit();
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        updateLastModified();
        
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        
        res.status(200).json({ 
          message: 'News post updated successfully using raw query',
          newsPost: result[0][0],
          lastModified: lastNewsUpdate
        });
      } catch (rawError) {
        await rawTransaction.rollback();
        throw rawError;
      }
    }
  } catch (error) {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }
    
    console.error('Error updating news post:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteNewsPost = async (req, res) => {
  const transaction = await News.sequelize.transaction();
  
  try {
    const newsId = req.params.id;
    
    try {
      const newsPost = await News.findByPk(newsId, { transaction });
      
      if (!newsPost) {
        await transaction.rollback();
        return res.status(404).json({ message: 'News post not found' });
      }
      
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

      await newsPost.destroy({ transaction });
      
      await transaction.commit();
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      updateLastModified();
      
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      
      res.status(200).json({ 
        message: 'News post deleted successfully',
        lastModified: lastNewsUpdate
      });
    } catch (modelError) {
      await transaction.rollback();
      
      console.error('Error using model destroy, trying raw query:', modelError);
      
      const rawTransaction = await News.sequelize.transaction();
      
      try {
        const getNewsQuery = await News.sequelize.query(
          `SELECT news_pdf_url, news_thumbnail_url FROM public.news WHERE news_id = :newsId`,
          {
            replacements: { newsId },
            type: News.sequelize.QueryTypes.SELECT,
            transaction: rawTransaction
          }
        );
        
        if (!getNewsQuery.length) {
          await rawTransaction.rollback();
          return res.status(404).json({ message: 'News post not found' });
        }
        
        const newsPost = getNewsQuery[0];
        
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
        
        const deleteQuery = await News.sequelize.query(
          `DELETE FROM public.news WHERE news_id = :newsId`,
          {
            replacements: { newsId },
            type: News.sequelize.QueryTypes.DELETE,
            transaction: rawTransaction
          }
        );
        
        await rawTransaction.commit();
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        updateLastModified();
        
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        
        res.status(200).json({ 
          message: 'News post deleted successfully using raw query',
          lastModified: lastNewsUpdate
        });
      } catch (rawError) {
        await rawTransaction.rollback();
        throw rawError;
      }
    }
  } catch (error) {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }
    
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
  getLastModified,
  upload
};