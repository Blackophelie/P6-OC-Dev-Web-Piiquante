const emailValidator = require("email-validator")
const passwordSchema = require("../models/password");

emailValidator.validate("test@email.com");

module.exports = (req, res, next) => {
   if (!emailValidator.validate(req.body.email)) {
      res.status(406).json({ message: ("Saisir un email valide (ex: pseudo@gmail.fr) !")})
   }
   next();
}

module.exports = (req, res, next) => {
   if (!passwordSchema.validate(req.body.password)) {
      res.status(406).json({ message: ("Mot de passe trop faible pour être accepté.") })
   }
   next();
};