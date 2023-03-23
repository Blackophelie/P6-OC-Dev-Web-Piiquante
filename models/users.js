const mongoose = require("mongoose");

// Modèle de schéma d'utilisateur
const userSchema = mongoose.Schema ({
   "email": { type: String, required: true, unique: true },
   "password": { type: String, required: true },
})

module.exports = mongoose.model("User", userSchema);