const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');

// Recover file from backup bucket (POST)
router.post('/recover', fileController.recoverFile);

// Download file from either bucket (GET)
router.get('/download/:key', async (req, res) => {
  const AWS = require('aws-sdk');
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

  const fileKey = req.params.key;
  const primaryBucket = process.env.PRIMARY_BUCKET;
  const backupBucket = process.env.BACKUP_BUCKET;

  const checkExists = async (bucket) => {
    try {
      await s3.headObject({ Bucket: bucket, Key: fileKey }).promise();
      return true;
    } catch (err) {
      return false;
    }
  };

  const generateSignedUrl = (bucket) => {
    return s3.getSignedUrl('getObject', {
      Bucket: bucket,
      Key: fileKey,
      Expires: 60,
    });
  };

  const existsInPrimary = await checkExists(primaryBucket);
  if (existsInPrimary) {
    const url = generateSignedUrl(primaryBucket);
    return res.json({ url });
  }

  const existsInBackup = await checkExists(backupBucket);
  if (existsInBackup) {
    try {
      await s3.copyObject({
        Bucket: primaryBucket,
        CopySource: `${backupBucket}/${fileKey}`,
        Key: fileKey,
      }).promise();

      const url = generateSignedUrl(primaryBucket);
      return res.json({ url });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to copy file from backup' });
    }
  }

  return res.status(404).json({ error: 'File not found in both buckets' });
});

module.exports = router;
