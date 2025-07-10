// controllers/fileController.js
const { uploadToBucket, downloadFromBucket } = require('../utils/s3Utils');
const { s3Mumbai, s3USA } = require('../config/aws');
const mumbaiBucket = process.env.MUMBAI_BUCKET;
const usaBucket = process.env.USA_BUCKET;
const fs = require('fs');

exports.uploadFile = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: 'No file uploaded' });

    const fileName = file.originalname;
    const fileContent = file.buffer;

    // Upload to Mumbai
    await uploadToBucket(s3Mumbai, mumbaiBucket, fileName, fileContent);
    // Backup to USA
    await uploadToBucket(s3USA, usaBucket, fileName, fileContent);

    res.status(200).json({ message: 'File uploaded and backed up successfully' });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
};

exports.recoverFile = async (req, res) => {
  try {
    const { fileName } = req.body;
    if (!fileName) return res.status(400).json({ error: 'Filename required' });

    // Check if file exists in Mumbai
    try {
      await downloadFromBucket(s3Mumbai, mumbaiBucket, fileName);
      return res.status(400).json({ error: 'File already exists in Mumbai bucket. Recovery not needed.' });
    } catch (mumbaiErr) {
      console.log('File not found in Mumbai. Trying to recover from USA...');
    }

    // Try to download from USA
    const usaData = await downloadFromBucket(s3USA, usaBucket, fileName);
    const content = usaData.Body;

    // Re-upload recovered file to Mumbai
    await uploadToBucket(s3Mumbai, mumbaiBucket, fileName, content);

    res.status(200).json({ message: 'File recovered and restored to Mumbai successfully' });
  } catch (err) {
    console.error('Recovery error:', err);
    res.status(500).json({ error: 'File recovery failed' });
  }
};
