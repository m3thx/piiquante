const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
})

userSchema.plugin(uniqueValidator); // Permet de vérifier qu'un email unique correspond à un seul utilisateur

module.exports = mongoose.model('User', userSchema);