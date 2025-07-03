const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  profileImage: {
    type: String // URL ou nom de fichier local
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);