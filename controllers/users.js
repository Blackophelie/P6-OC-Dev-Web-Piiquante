const bcrypt = require("bcrypt");
const User = require("../models/users");
const jwt = require("jsonwebtoken");
const emailValidator = require("../middleware/validator")

// INSCRIPTION (SIGN UP)
exports.signup = (req, res) => {

   // Si le format de l'email est valide
   if (emailValidator) {
      // Hâche le mot de passe
      bcrypt.hash(req.body.password, 10)
         .then(hash => {
            const user = new User({
               email: req.body.email,
               password: hash
            });
            // Enregistre le nouvel utilisateur
            user.save()
               .then(() => res.status(201).json({ message: "Nouvel utilisateur enregistré !" }))
               .catch(error => res.status(400).json({ error }));
         })
         .catch(error => res.status(500).json({ error }));

   // Si le format de l'email est invalide
   } else if (emailValidator != true) {
      res.status(406).json({ message: "E-mail non valide" })
   }
};

// LOGIN
exports.login = (req, res) => {
   const { email, password } = req.body;

   // Cherche l'utilisateur via son e-mail
   User.findOne({ email})
      .then((user) => {
         
         // Si e-mail inexistant
         if (!user) {
            res.status(401).send({ message: "Utilisateur inconnu" });
         // Sinon, compare les mots de passe, et si OK, génère un token pour 24h
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