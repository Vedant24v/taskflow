const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');

const bcrypt = require('bcryptjs');
const Task = require('../models/Task');

// GET /api/users
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find({ $or: [{ _id: req.user.id }, { ownerId: req.user.id }] }).select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// POST /api/users
router.post('/', auth, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Auto-generate color based on name length/hash or just random
    const colors = ['#4f8ef7', '#a78bfa', '#34d399', '#fbbf24', '#f87171', '#22d3ee', '#ec4899', '#14b8a6'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    user = new User({
      name,
      email,
      password,
      role: role || 'Member',
      color: randomColor,
      ownerId: req.user.id
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    // Return user without password
    const userToReturn = await User.findById(user._id).select('-password');
    res.json(userToReturn);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// DELETE /api/users/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.ownerId && user.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Set tasks assigned to this user to unassigned (null)
    await Task.updateMany({ assigneeId: req.params.id }, { $set: { assigneeId: null } });

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
