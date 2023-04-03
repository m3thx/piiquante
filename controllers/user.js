const User = require('../models/User');
const bcrypt = require('bcrypt');
const express = require('express');
const jwt = require('jsonwebtoken')

const TOKEN_KEY = process.env.TOKEN_KEY;



// création utilisateur avec password crypté - OP
exports.signup = (req, res) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            })
            console.log(user);
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur crée' }))
                .catch(error => res.status(400).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))

};

// Recherche user dans la base de données et attribution d'un token
exports.login = (req, res) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Paire email/mot de passe incorrecte' });
            }
            bcrypt.compare(req.body.password, user.password) // compare le mdp de la requête avec celui de la base de données
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire email/mot de passe incorrecte' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            // {
                            //     userId: user.id,
                            //     token: 'TOKEN'
                            // }
                            { userId: user._id },
                            TOKEN_KEY,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => {
                    res.status(500).json({ error }),
                    console.log(error)
                });

        })
        .catch(error => res.status(500).json({ error }));
};

