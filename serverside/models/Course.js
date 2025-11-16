const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  platform: { type: String, default: '' },
  link: { type: String, default: '' },
  category: { type: String, default: 'General' },
  status: { type: String, enum: ['Not Started','In Progress','Completed'], default: 'Not Started' },
  progress: { type: Number, min: 0, max: 100, default: 0 },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', courseSchema);
