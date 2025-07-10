//aws.js

const AWS = require('aws-sdk');


AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'ap-south-1',  // default region (Mumbai)
});

const s3Mumbai = new AWS.S3({ region: 'ap-south-1' });
const s3USA = new AWS.S3({ region: 'us-east-1' });

module.exports = { s3Mumbai, s3USA };
