require('dotenv').config(); // Pour les variables d'environnement
const express = require('express'); // va chercher express dans le node_modules
const bodyParser = require('body-parser');// va chercher body-parser dans le node_modules
const mongoose = require('mongoose');// va chercher mongoose dans le node_modules
const path = require("path");// va chercher path dans le node_modules
const userRoutes = require("./routes/users"); 
const sauceRoutes = require("./routes/sauces");
const app = express(); // 

// Variables d'environnement
const password = process.env.DB_PASSWORD; 
const userName = process.env.DB_USER;
mongoose.set('strictQuery', false);

const uri = "mongodb+srv://" + userName + ":" + password + "@atlascluster.kdoksov.mongodb.net/piiquante?retryWrites=true&w=majority"; // lien vers la collection "piiquante" sur MongoDB

mongoose // connection à la collection "piiquante" sur mongoDB
  .connect(uri)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
  
app.use(express.json());
app.use(bodyParser.json());

//CORS (Cross-origin resource sharing)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // autorise les connections depuis n'importe quelle adresse IP
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // autorise les headers
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // autorise les méthodes indiquées
  next();
});

//ROUTES
app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;