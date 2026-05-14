const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['not_started', 'in_progress', 'completed'], default: 'not_started' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
  assigneeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  deadline: { type: String },
  tag: { type: String }
}, { timestamps: true });

// Convert id to string to match frontend 'id' instead of '_id'
taskSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  }
});

module.exports = mongoose.model('Task', taskSchema);
