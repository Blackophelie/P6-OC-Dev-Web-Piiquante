// Route pour les sauces
const Sauce = require("../models/sauces");
// Module file system
const fs = require("fs");

// AFFICHER TOUTES LES SAUCES (GET)
exports.getAllSauces = (req, res) => {
   Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
};

// CREER UNE SAUCE (POST)
exports.createSauce = (req, res) => {
   const sauceObject = JSON.parse(req.body.sauce);

   // delete sauceObject._id;
   delete sauceObject.userId;

   // Crée une nouvelle sauce
   const newSauce = new Sauce({
      ...sauceObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
   });

   // Enregistre la nouvelle sauce
   newSauce.save()
      .then(() => { res.status(201).json({ message: 'Sauce enregistrée !' })})
      .catch(error => { res.status(400).json( { error })});
};

// AFFICHER UNE SAUCE SELECTIONNEE (GET)
exports.getOneSauce = (req, res) => {
   Sauce.findOne({ _id: req.params.id })
     .then(sauce => res.status(200).json(sauce))
     .catch(error => res.status(404).json({ error }));
};

// MODIFIER UNE SAUCE (PUT)
exports.modifySauce = (req, res) => {
   const sauceObject = req.file ? {
       ...JSON.parse(req.body.sauce),
       imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
   } : { ...req.body };
   delete sauceObject.userId

   Sauce.findOne({_id: req.params.id})
      .then((sauce) => {

         // Si userId ne correspond pas à celui attendu
         if (sauce.userId != req.auth.userId) {
            res.status(401).json({ message : 'Non autorisé'});
         
         // Si userId correspond
         } else {
            if (!req.body.sauce) {
            // Update l'objet sauce
            Sauce.updateOne( { _id: req.params.id}, { ...sauceObject, _id: req.params.id})
               .then(() => res.status(200).json({message : 'Sauce modifiée !'}))
               .catch(error => res.status(401).json({ error }));
         
            // Si la photo change
            } else {
               // Récupère le filename de la photo
               const filename = sauce.imageUrl.split("/images/")[1];

               // Supprime l'ancienne photo et update l'objet sauce
               fs.unlink("images/" + filename, () => {
                  Sauce.updateOne( { _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                     .then(() => res.status(200).json({message : 'Sauce modifiée !'}))
                     .catch(error => res.status(401).json({ error }));
               });
            }
         }
      })
      .catch(error => res.status(400).json({ error }));
};

// SUPPRIMER UNE SAUCE (DELETE)
exports.deleteSauce = (req, res) => {
   Sauce.findOne({ _id: req.params.id })
     .then(sauce => {
         // Si le userId ne correspond pas
         if (sauce.userId != req.auth.userId) {
         res.status(401).json({ message: "Non autorisé" });

         // Si le userId correspond
         } else {
            const filename = sauce.imageUrl.split("/images/")[1];

            // Supprime l'image et de l'objet sauce
            fs.unlink("images/" + filename, () => {
               Sauce.deleteOne({ _id: req.params.id })
                  .then(() => { res.status(200).json({message: 'Sauce supprimée !'})})
                  .catch(error => res.status(401).json({ error }));
            });
         }
      })
      .catch( error => res.status(500).json({ error }));
};

// LIKE OU DISLIKE (POST)
exports.didUserLike = async (req, res) => {
   
   const { like, userId } = req.body;

   const sauce = await Sauce.findOne({ _id: req.params.id })

   // Si l'utilisateur aime la sauce
   if (like === 1) {
      if (!sauce.usersLiked.includes(userId)){
         // Ajoute 1 aux likes et ajoute l'userId dans usersLiked
         try {
            await Sauce.updateOne({ _id: req.params.id }, { $addToSet: { usersLiked: userId }, $inc: { likes: +1 } })
            return res.status(200).json({ message: "Vous avez aimé la sauce !" })
         }
         catch (error) {
            return res.status(400).json({ error });
         }
      }
   }
   
   // Si l'utilisateur n'aime pas la sauce
   else if (like === -1) {
      if (!sauce.usersDisliked.includes(userId)) {
         // Ajoute 1 aux dislikes et ajoute l'userId dans usersDisliked
         try  {
            await Sauce.updateOne({ _id:req.params.id }, { $addToSet: { usersDisliked: userId }, $inc: { dislikes: +1 } })
            return res.status(200).json({ message: "Vous n'avez pas aimé la sauce !" })
         }
         catch (error) { 
            return res.status(400).json({ error });
         }
      } 
   }

   // Quand userId existe dans usersLiked ou usersDisliked (l'utilisateur a déjà voté et annule son vote)
   else if (like === 0) {
      
      //Si userId présent dans usersLiked
      if (sauce.usersLiked.includes(userId)) {
         // Retire userId de usersLiked et 1 aux likes
         try {
            await Sauce.updateOne({ _id:req.params.id }, { $pull: { usersLiked: userId }, $inc: { likes: -1 } })
            return res.status(200).json({ message: "Votre vote a été annulé"})
         }
         catch (error) {
            return res.status(400).json({ error })
         }
      } 
         
      // Si userId présent dans usersDisliked
      else if (sauce.usersDisliked.includes(userId)) {
         // Retire userId de usersDisliked et 1 aux dislikes
         try {
            await Sauce.updateOne({ _id:req.params.id }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } })
            return res.status(200).json({ message: "Votre vote a été annulé"})
         }
         catch (error) {
            return res.status(400).json({ error })
         }
      }
   }
   return res.status(400).json({ message: "Opération interdite !!"})
};