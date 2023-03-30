const { error } = require('console');
const { text } = require('stream/consumers');
const fs = require("fs");
const Sauce = require('../models/Sauce')

// Affiche toutes les sauces
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then((sauce) => res.status(200).json(sauce))
        .catch((error) => res.status(400).json({ error }))
}

// Création d'une sauce
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
        .then(() => res.status(201).json({ message: 'La sauce à été crée !' }))
        .catch((error) => res.status(400).json({ error }))
}

// Affiche une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => res.status(200).json(sauce))
        .catch((error) => res.status(400).json({ error }))
}

// Suppression de sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            // Extraction du nom du fichier
            const fileName = sauce.imageUrl.substring(sauce.imageUrl.lastIndexOf('/') + 1)
            fs.unlink('./images/' + fileName, (error) => {
                if (error) {
                    throw error;
                } console.log('Image supprimée')
            })
        })
        .then(() => {
            Sauce.deleteOne({ _id: req.params.id })
                .then(() => { res.status(200).json('La sauce à été supprimée !') })
                .catch((error) => res.status(400).json({ error }))
        })

        .catch((error) => res.status(400).json({ error }))
};

// Modification de sauce
exports.modifySauce = (req, res, next) => {
    if (req.file === undefined) {
        Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'La sauce à été modifiée !' }))
            .catch((error) => res.status(400).json({ error }))
    } else {
        // Comme indiqué dans le document Requirements si ume image est fourni la sauce est transformé en chaine de caractère dans req.body.sauce, il faut donc parser cette requête 
        const sauceObject = JSON.parse(req.body.sauce)
        const sauceId = req.params.id
        const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        Sauce.findOne({ _id: sauceId })
            .then((sauce) => {
                // Extraction du nom du fichier
                const fileName = sauce.imageUrl.substring(sauce.imageUrl.lastIndexOf('/') + 1)
                console.log(fileName)
                Sauce.updateOne({ _id: sauceId }, {
                    ...sauceObject,
                    imageUrl: imageUrl
                })
                    .then((sauce) => {
                        fs.unlink('./images/' + fileName, (error) => {
                            if (error) {
                                throw error;
                            } console.log('Image supprimée')
                        })
                    })
            })
            .then(() => res.status(200).json({ message: 'La sauce à été modifiée !' }))
            .catch((error) => res.status(400).json({ error }))
    }
}

// 
exports.likeSauce = (req, res, next) => {
    const sauceId = req.params.id
    const userId = req.body.userId
    const like = req.body.like

    // L'utilisateur like
    if (like === 1) {
        Sauce.updateOne({ _id: sauceId },
            { $push: { usersLiked: userId }, $inc: { likes: 1 } })
            .then(() => res.status(200).json({ message: 'La sauce à été likée !' }))
            .catch((error) => res.status(400).json({ error }))

    }
    // L'utilisateur dislike
    if (like === -1) {
        Sauce.updateOne({ _id: sauceId },
            { $push: { usersDisliked: userId }, $inc: { dislikes: 1 } })
            .then(() => res.status(200).json({ message: 'La sauce à été likée !' }))
            .catch((error) => res.status(400).json({ error }))
    }
    // L'utilisateur retire soit son like ou son dislike
    if (like === 0) {
        Sauce.findOne({ _id: req.params.id })
            .then((sauce) => {
                if (sauce.usersLiked.includes(userId)) {
                    Sauce.updateOne({ _id: req.params.id },
                        { $pull: { usersLiked: userId }, $inc: { likes: -1 } })
                        .then(() => res.status(200).json({ message: 'Le like à été retiré' }))
                        .catch((error) => res.status(400).json({ error }));
                }
                if (sauce.usersDisliked.includes(userId)) {
                    Sauce.updateOne({ _id: req.params.id },
                        { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } })
                        .then(() => res.status(200).json({ message: 'Le dislike à été retiré' }))
                        .catch((error) => res.status(400).json({ error }));
                }
            })
    }
}


    //     }
    //     if (req.body.like === -1) {
    //         Sauce.updateOne({ _id: req.params.id }, { $push: { usersDisliked: userId }, $inc: { dislikes: 1 } })
    //             .then(() => { res.status(201).json({ message: 'La sauce à été dislikée !' }) })
    //             .catch((error) => res.status(400).json({ error }))
    //     }
    //     // if (sauce.usersLiked.userId === null && req.body.like === 0) {
    //     //     Sauce.updateOne({ _id: req.params.id },
    //     //         { $pull: { usersLiked: userId }, $inc: { likes: -1 } })
    //     //         .then((sauces) => res.status(201).json({ message: 'Le like à été supprimé' }))
    //     //         .catch((error) => res.status(400).json({ error }))
    //     // }

    // })

    // if (req.body.like === 1) {
    //     console.log(req.body)
    //     Sauce.updateOne({ _id: req.params.id }, { $push: { usersLiked: userId }, $inc: { likes: 1 } })
    //         .then((sauces) => res.status(201).json({ message: 'Sauce likée !' }))
    //         .catch((error) => res.status(400).json({ error }))
    // }
    // if (req.body.like === -1) {
    //     console.log(req.body)
    //     Sauce.updateOne({ _id: req.params.id }, { $push: { usersDisliked: userId }, $inc: { dislikes: 1 } })
    //         .then(() => { res.status(201).json({ message: 'Sauce dislikée !' }) })
    //         .catch((error) => res.status(400).json({ error }))
    // }
    // if (req.body.like === 0) {
    //     console.log(req.body)
    //     Sauce.find({ _id: req.params.id, usersLiked: { userId } }, { pull: { usersLiked: userId }, inc: { likes: -1 } })
    //         .then(() => { res.status(201).json({ message: 'Like effacé !' }) })
        //         .catch((error) => { res.status(400).json({ error }), console.log(error) })
        //     //     } else {
        //     //         Sauce.updateOne({ _id: req.params.id, usersDisliked: { $in :[userId]} }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } })
        //     //             .then(() => { res.status(201).json({ message: 'Dislike effacé !' }) })
        //     //             .catch((error) => res.status(400).json({ error }))
        //     //     }
        //     //     Sauce.find({ _id: req.params.id, usersLiked: {$elemMatch: {userId}} }, )
        //     //     .then(() => { res.status(201).json({ message: 'Sauce dislikée !' }), console.log('Trouvé') })
        //     //     .catch((error) => { res.status(400).json({ error }), console.log('Pas trouvé') })
        //     // }

