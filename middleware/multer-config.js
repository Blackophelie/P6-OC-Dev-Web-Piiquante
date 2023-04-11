// Multer : Pour gérer les requêtes HTTP avec envoi de fichier
// Importation de multer
const multer = require('multer'); 

// Importation de path
const path = require("path");

// Dictionnaire de MIME_TYPES
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// Destination du fichier (répertoire) et génération d'un nom de fichier unique
const storage = multer.diskStorage({

  // Destination de stockage du fichier image
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const extension = MIME_TYPES[file.mimetype];
    
    // Supprime les espaces et les remplacer par des _
    const name = file.originalname.split(' ').join('_');
    // Crée un nouveau nom pour la photo
    const photoName = path.parse(name);
    callback(null, photoName.name + "_" + Date.now() + '.' + extension);
  }
});

// Exportation du middleware multer
module.exports = multer({ storage }).single('image');