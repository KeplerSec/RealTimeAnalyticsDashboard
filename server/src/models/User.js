const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  email: String,
  passwordHash: String
});
module.exports = mongoose.model('User', userSchema);