// ----------------Importations----------------------

const express = require("express");

// Contrôleur sauce
const sauceCtrl = require("../controllers/sauces");

// Middleware d'authentification
const auth = require("../middleware/auth");

// Middleware multer pour gestion des fichiers image
const multer = require("../middleware/multer-config");

// Méthode d'express Router()
const router = express.Router();

// Routes
router.get("/", sauceCtrl.getAllSauces);
router.get("/:id", sauceCtrl.getOneSauce);
router.post("/", auth, multer, sauceCtrl.createSauce);
router.put("/:id", auth, multer, sauceCtrl.modifySauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);
router.post("/:id/like", auth, sauceCtrl.didUserLike);

module.exports = router;