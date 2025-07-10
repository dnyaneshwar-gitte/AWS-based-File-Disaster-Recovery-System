// controllers/authController.js
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Utility to calculate plan info
const calculateSubscription = (plan) => {
  const start = new Date();
  let end = new Date(start);
  let storageLimitGB = 10;
  let features = [];

  if (plan === 'free') {
    end.setMonth(start.getMonth() + 1);
  } else if (plan === 'premium_1m') {
    end.setMonth(start.getMonth() + 1);
    storageLimitGB = 100;
    features = ['backup'];
  } else if (plan === 'premium_3m') {
    end.setMonth(start.getMonth() + 3);
    storageLimitGB = 1000;
    features = ['backup', 'recovery'];
  }

  return { startDate: start, endDate: end, storageLimitGB, features };
};

// Signup controller
const signup = async (req, res) => {
  const { email, password, name, plan = 'free' } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const { startDate, endDate, storageLimitGB, features } = calculateSubscription(plan);

    const user = new User({
      email,
      password,
      name,
      subscription: {
        plan,
        startDate,
        endDate,
        storageLimitGB,
        features,
      },
    });

    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Error while creating user' });
  }
};

// Login controller
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials - user not found' });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(400).json({ message: 'Invalid credentials - password mismatch' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, plan: user.subscription.plan, expires: user.subscription.endDate });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error while logging in' });
  }
};

module.exports = { signup, login };