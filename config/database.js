const mongoose = require('mongoose');

require('dotenv').config();

/**
 * -------------- DATABASE ----------------
 */

/**
 * Connect to MongoDB Server using the connection string in the `.env` file.  To implement this, place the following
 * string into the `.env` file
 * 
 * DB_STRING=mongodb://<user>:<password>@localhost:27017/database_name
 */ 

const mongoDb = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@${process.env.COLLECTION}.uqtjxjp.mongodb.net/${process.env.COLLECTION}?retryWrites=true&w=majority`;
mongoose.connect(mongoDb);
const connection = mongoose.connection;
connection.on("error", console.error.bind(console, "mongo connection error"));

// Creates simple schema for a User.  The hash and salt are derived from the user's given password when they register
const UserSchema = new mongoose.Schema({
    username: String,
    hash: String,
    salt: String,
    admin: Boolean,
});


const User = connection.model('User', UserSchema);

// Expose the connection
module.exports = connection;
