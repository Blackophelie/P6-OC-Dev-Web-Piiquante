const bcrypt = require("bcrypt");
const User = require("../models/users");
const jwt = require("jsonwebtoken");

exports.signup = (req, res) => {
   bcrypt.hash(req.body.password, 10)
      .then(hash => {
         const user = new User({
            email: req.body.email,
            password: hash
         });
         user.save()
            .then(() => {
               res.status(201).json({ message: "Nouvel utilisateur enregistré !" })
            })
            .catch(error => {
               res.status(400).json({ error})
            });
      })
      .catch(error => res.status(500).json({ error}));
   
};

exports.login = (req, res) => {
   const { email, password } = req.body;
   User.findOne({ email})
      .then((user) => {
         if (!user) {
            res.status(401).send({ message: "Utilisateur inconnu" });
         } else {
            bcrypt.compare(password, user.password)
               .then((valid) => {
                  if (valid) {
                     res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                           { userId: user._id },
                           "RANDOM_TOKEN_SECRET",
                           { expiresIn: "24h" }
                        )
                     })
                  } else {
                     res.status(401).send({ message: "Mot de passe incorrect !" });
                  };
               });
         };
      })
      .catch((err) => console.log("Erreur lors de la connexion", err));
};