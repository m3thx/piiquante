const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
    userId: { mongoose.ObjectId, required: true },
    name: { type: String },
    manufacturer: { type: String },
    description: { type: String },
    mainPepper: { type: String },
    imageUrl: { type: String },
    heat: { type: Number, min: 1, max: 10 },
    likes: { type: Number },
    dislikes: { type: Number },
    usersLiked: { type: [ "String <userId>" ] },
    usersDisliked: { type: [ "String <userId>" ] }
});

module.exports = mongoose.model('sauce', sauceSchema);