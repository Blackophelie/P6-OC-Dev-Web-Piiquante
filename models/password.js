const passwordValidator = require("password-validator")

let schema = new passwordValidator();

schema
.is().min(8)                                    // 8 caractères minimum
.is().max(100)                                  // 30 caractères maximum
.has().uppercase()                              // Doit contenir au moins une majuscule
.has().lowercase()                              // Doit contenir au moins une minuscule
.has().digits(2)                                // Doit contenir au moins 2 chiffres
.has().not().spaces();                           // Ne doit pas contenir d'espace
// .is().not().oneOf(['Passw0rd', 'Password123']); // Interdire ces valeurs

module.exports = schema;