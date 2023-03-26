const { error } = require('console');
const Sauce = require('../models/Sauce')

exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then((sauces) => { res.status(200).json(sauces) })
        .catch((error) => { res.status(400).json({ error }) })
}

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce)
    delete sauceObject._id
    delete sauceObject._userId
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => { res.status(201).json({ massage: 'Sauce crée !' }) })
        .catch((error) => res.status(400).json({ error }))
}

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauces) => { res.status(200).json(sauces) })
        .catch((error) => { res.status(400).json({ error }) })
}

exports.deleteSauce = (req, res, next) => {
    Sauce.deleteOne({ _id: req.params.id })
        .then((sauces) => { res.status(200).json(sauces) })
        .catch((error) => { res.status(400).json({ error }) })
}