const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/authMiddleware');

// GET /api/tasks
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ ownerId: req.user.id }).populate('assigneeId', 'name initials color role');
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// POST /api/tasks
router.post('/', auth, async (req, res) => {
  try {
    const newTask = new Task({ ...req.body, ownerId: req.user.id });
    const task = await newTask.save();
    // populate assigneeId right after creation
    await task.populate('assigneeId', 'name initials color role');
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// PUT /api/tasks/:id
router.put('/:id', auth, async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.ownerId.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).populate('assigneeId', 'name initials color role');

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// DELETE /api/tasks/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.ownerId.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
