const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, default: 'Member' },
  color: { type: String, default: '#4f8ef7' },
  initials: { type: String },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

userSchema.pre('save', function() {
  if (this.name && !this.initials) {
    const names = this.name.split(' ');
    this.initials = names.map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }
});

module.exports = mongoose.model('User', userSchema);
