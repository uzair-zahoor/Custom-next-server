const mongoose = require('mongoose');
let User = null;

if (mongoose.models.User) {
  User = mongoose.model('User');
} else {
  const userSchema = mongoose.Schema({
    uname: {
      type: String,
    },
    sname: {
      type: String,
    },
    email: {
      type: String,
    },
    contact: {
      type: String,
    }
  });

  User = mongoose.model('User', userSchema);
}

module.exports = {
    User
};