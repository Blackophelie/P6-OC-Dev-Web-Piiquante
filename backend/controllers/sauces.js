const mongoose = require("mongoose");
const fs = require("fs");
const Sauce = require("../models/sauces");

exports.getAllSauces = (req, res) => {
   Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
};

exports.createSauce = (req, res) => {
   const sauceObject = JSON.parse(req.body.sauce);
   const sauce = new Sauce({
      ...sauceObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
   });
   sauce.save()
      .then(() => { res.status(201).json({message: 'Sauce enregistrée !'})})
      .catch(error => { res.status(400).json({ error })});
};

exports.getOneSauce = (req, res, next) => {
   Sauce.findOne({ _id: req.params.id })
     .then(sauce => res.status(200).json(sauce))
     .catch(error => res.status(404).json({ error }));
};

exports.modifySauce = (req, res) => {
   const sauceObject = req.file ? {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
   } : { ...req.body };
   
   Sauce.findOne({_id: req.params.id})
      .then((sauce) => {
         if (sauce.userId != req.auth.userId) {
            res.status(401).json({ message : 'Non autorisé'});
            return;
         }
         // } else {
         // Mise à jour de la sauce
         Sauce.updateOne({ _id: req.params.id }, 
            { ...sauceObject })
            .then(() => res.status(200).json({message : 'Sauce modifiée !'}))
            .catch(error => res.status(401).json({ error }))

         // Suppression de l'image uniquement si changée
         if (req.file) {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`);

         }
         // }
      })
      .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res) => {
   Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
         if (sauce.userId != req.auth.userId) {
            res.status(401).json({message: 'Non autorisé'});
         } else {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
               Sauce.findByIdAndDelete({_id: req.params.id})
                  .then(() => { res.status(200).json({message: 'Sauce supprimée !'}) })
                  .catch(error => res.status(401).json({ error }));
            });
         }
      })
      .catch(error => res.status(500).json({ error }));
};

exports.didUserlike = (req, res) => {
   const { like, userId, usersLiked, usersDisliked } = req.body
   console.log(req.body);
   // Si la valeur de like est différente de 0, -1 ou 1 :
   if (![0, -1, 1].includes(like)) {
      return res.status(403).json({ message: 'Valeur de Like invalide' })
   } else {
      // Si usersLiked inclus déjà le userId, alors le like n'est pas retenu
      if (userId.includes(usersLiked)) {
         return
      // Sinon, incrémenter le like et enregistrer
      } else {
         
         (res.status(200).json({ message : 'Like enregistré' }))
      }
   };
   // si userId du liker est identique à userId du manufacturer

   // Si usersiked inclus déjà le userId, alors le like n'est pas retenu
   console.log("like : "+ typeof(like) + " " + like, "userId: " +userId);

};