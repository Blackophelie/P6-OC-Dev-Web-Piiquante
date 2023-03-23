// ----------------Importations----------------------

const express = require("express");

// Contrôleur sauce
const sauceCtrl = require("../controllers/sauces");

// Middleware multer pour gestion des fichiers image
const multer = require("../middleware/multer-config");

// Méthode d'express Router()
const router = express.Router();

// Routes
router.get("/", sauceCtrl.getAllSauces);
router.get("/:id", sauceCtrl.getOneSauce);
router.post("/", multer, sauceCtrl.createSauce);
router.put("/:id", multer, sauceCtrl.modifySauce);
router.delete("/:id", sauceCtrl.deleteSauce);
router.post("/:id/like", sauceCtrl.didUserLike);

module.exports = router;