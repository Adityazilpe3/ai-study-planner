const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const protect = require('../middleware/authMiddleware');

// GET /api/user/profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/user/profile
router.put('/profile', protect, async (req, res) => {
  const { name, bio, currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;

    if (newPassword) {
      if (!currentPassword)
        return res.status(400).json({ message: 'Current password is required' });

      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch)
        return res.status(400).json({ message: 'Current password is incorrect' });

      user.password = newPassword;
    }

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
