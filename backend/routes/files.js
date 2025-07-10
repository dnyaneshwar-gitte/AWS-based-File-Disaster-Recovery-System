//routes/files.js

const express = require('express');
const AWS = require('aws-sdk');
const router = express.Router();

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,     // store in .env
  secretAccessKey: process.env.AWS_SECRET_KEY, // store in .env
  region: process.env.AWS_REGION,
});

// List files from S3 bucket
router.get('/list', async (req, res) => {
  const Bucket = process.env.AWS_BUCKET_NAME;

  const params = {
    Bucket,
  };

  try {
    const data = await s3.listObjectsV2(params).promise();
    const files = data.Contents.map((item) => ({
      name: item.Key,
      url: `https://${Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`,
    }));
    res.json({ files });
  } catch (err) {
    console.error('S3 list error:', err);
    res.status(500).json({ error: 'Failed to list files' });
  }
});

module.exports = router;
