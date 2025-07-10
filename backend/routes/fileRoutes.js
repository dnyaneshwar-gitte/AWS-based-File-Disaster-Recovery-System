const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const upload = require('../middleware/upload');
const fileController = require('../controllers/fileController');

// ✅ Create S3 client
const s3Mumbai = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// ✅ Upload route
router.post('/upload', upload.single('file'), fileController.uploadFile);

// ✅ Delete route (FULLY DEBUGGED)
router.post('/delete', async (req, res) => {
  const { fileName } = req.body;
  const bucket = process.env.MUMBAI_BUCKET;

  if (!fileName) {
    return res.status(400).json({ error: 'fileName is required' });
  }

  const params = { Bucket: bucket, Key: fileName };

  console.log('🧾 Delete request received for:', params);

  try {
    await s3Mumbai.deleteObject(params).promise();
    console.log(`✅ File "${fileName}" deleted successfully`);
    res.json({ message: 'File deleted from Mumbai bucket' });
  } catch (err) {
    console.error('❌ Delete failed:', {
      message: err.message,
      code: err.code,
      stack: err.stack,
    });

    res.status(500).json({
      error: 'Failed to delete file',
      details: err.message,
      code: err.code,
    });
  }
});

module.exports = router;
