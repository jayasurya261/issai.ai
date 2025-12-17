const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    firstName: String,
    lastName: String,
    imageUrl: String,
    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
