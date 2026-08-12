const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// console.log("☁️ CLOUDINARY CONFIG CHECK:", {
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   // Print the first 4 characters of the secret to see if there's a stray quote or space
//   secret_preview: process.env.CLOUDINARY_API_SECRET ? process.env.CLOUDINARY_API_SECRET.substring(0, 4) + "..." : "MISSING"
// })

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: 'venue-images',
//     allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
//   },
// });
const storage = multer.memoryStorage()
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
      return;
    }
    cb(new Error('Unsupported image format'));
  },
});

const upload = multer({ storage: storage });

module.exports = upload;