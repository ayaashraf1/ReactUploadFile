import express from 'express';
import multer, { diskStorage } from 'multer';
import cors from 'cors';

const app = express();
const port = 3000; // You can use any available port

app.use(cors());

// Multer Configuration
const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// File Upload Endpoint
app.post('/uploadFiles', upload.array('file'), (req, res) => {
    if (!req.files.length) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({ message: 'File uploaded successfully' });
});

  
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});