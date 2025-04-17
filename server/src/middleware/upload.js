
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath;
    
    if (file.fieldname === 'image') {
      uploadPath = path.join('/app/uploads/images');
    } else if (file.fieldname === 'pdf') {
      uploadPath = path.join('/app/uploads/pdfs');
    } else {
      uploadPath = path.join('/app/uploads/misc');
    }
    
    ensureDirectoryExists(uploadPath);
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

const fileFilter = (req, file, cb) => {
  console.log('Processing file:', file.originalname, 'of type:', file.mimetype);
  
  if (file.fieldname === 'image') {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
  } else if (file.fieldname === 'pdf') {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed!'), false);
    }
  }
  
  cb(null, true);
};

const uploadConfig = {
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter
};

const upload = multer(uploadConfig);

const configuredUpload = {
  fields: [
    { name: 'image', maxCount: 1 },
    { name: 'pdf', maxCount: 1 }
  ]
};

module.exports = { 
  upload: upload.fields(configuredUpload.fields),
  uploadMiddleware: upload
};