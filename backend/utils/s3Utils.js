// utils/s3Utils.js
const uploadToBucket = (s3, bucketName, key, body) => {
  return s3.upload({ Bucket: bucketName, Key: key, Body: body }).promise();
};

const downloadFromBucket = (s3, bucketName, key) => {
  return s3.getObject({ Bucket: bucketName, Key: key }).promise();
};

const deleteFromBucket = (s3, bucketName, key) => {
  return s3.deleteObject({ Bucket: bucketName, Key: key }).promise();
};

module.exports = { uploadToBucket, downloadFromBucket, deleteFromBucket };
