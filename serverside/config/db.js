const mongoose = require('mongoose');

async function connectDB(uri) {
  return mongoose.connect(uri, {
    // mongoose options are okay kept default for Mongoose 7+
  });
}

module.exports = connectDB;
