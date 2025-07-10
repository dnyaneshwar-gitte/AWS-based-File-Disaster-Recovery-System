require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const fileRoutes = require('./routes/fileRoutes');
const listRoutes = require('./routes/files'); // ✅ Fixed path
const recoverRoute = require('./routes/recoverRoute');

const app = express();
app.use(cors());
app.use(express.json());

console.log('Connecting to MongoDB at:', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/files', listRoutes);
app.use('/api/files', recoverRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
