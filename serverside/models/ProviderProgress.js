const mongoose = require('mongoose');

const providerProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  provider: { type: String, required: true }, // e.g., 'udemy'
  url: { type: String, required: true },
  progress: { type: Number, min: 0, max: 100, default: 0 },
  status: { type: String, enum: ['Not Started','In Progress','Completed'], default: 'Not Started' },
  notes: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now }
});

providerProgressSchema.index({ user: 1, provider: 1, url: 1 }, { unique: true });

module.exports = mongoose.model('ProviderProgress', providerProgressSchema);
