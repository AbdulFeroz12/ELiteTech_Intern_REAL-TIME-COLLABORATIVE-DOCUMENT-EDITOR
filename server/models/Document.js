const mongoose = require('mongoose');

const docSchema = new mongoose.Schema({
  _id: { type: String }, // we'll use our own generated id
  content: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now }
}, { _id: false });

module.exports = mongoose.model('Document', docSchema);
