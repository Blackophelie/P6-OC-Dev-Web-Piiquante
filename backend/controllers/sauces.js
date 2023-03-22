const Sauce = require("../models/sauces");
const fs = require("fs");

exports.getAllSauces = (req, res) => {
   Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
};

exports.createSauce = (req, res) => {
   const sauceObject = JSON.parse(req.body.sauce);
   delete sauceObject._id;
   delete sauceObject.userId;
   const sauce = new Sauce({
      ...sauceObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
   });
   sauce.save()
      .then(() => { res.status(201).json({message: 'Sauce enregistrée !'})})
      .catch(error => { res.status(400).json( { error })});
};

exports.getOneSauce = (req, res) => {
   Sauce.findOne({ _id: req.params.id })
     .then(sauce => res.status(200).json(sauce))
     .catch(error => res.status(404).json({ error }));
};

// exports.deleteImage = (req, res) => {

// };

exports.modifySauce = (req, res) => {
   const sauceObject = req.file ? {
       ...JSON.parse(req.body.sauce),
       imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
   } : { ...req.body };

   delete sauceObject.userId;
   Sauce.findOne({_id: req.params.id})
      .then((sauce) => {
         if (sauce.userId != req.auth.userId) {
            res.status(401).json({ message : 'Non autorisé'});
         } else {
            const filename = sauce.imageUrl.split("/images/")[1];
            fs.unlink("images/" + filename, () => {
               Sauce.updateOne( { _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                  .then(() => res.status(200).json({message : 'Sauce modifiée !'}))
                  .catch(error => res.status(401).json({ error }));
            });
         }
      })
      .catch((error) => {
         res.status(400).json({ error });
      });
};

exports.deleteSauce = (req, res) => {
   Sauce.findOne({ _id: req.params.id })
     .then(sauce => {
         if (sauce.userId != req.auth.userId) {
         res.status(401).json({ message: "Non autorisé" });
         } else {
            const filename = sauce.imageUrl.split("/images/")[1];
            fs.unlink("images/" + filename, () => {
               Sauce.deleteOne({ _id: req.params.id })
                  .then(() => { res.status(200).json({message: 'Sauce supprimée !'})})
                  .catch(error => res.status(401).json({ error }));
            });
         }
      })
      .catch( error => res.status(500).json({ error }));
};

exports.didUserLike = (req, res) => {
   const { like, userId } = req.body;
   if (like === 1) {  // J'aime
      Sauce.updateOne({ _id: req.params.id }, { $push: { usersLiked: userId }, $inc: { likes: +1 } })
         .then(() => res.status(200).json({ message: "Vous avez aimé la sauce !" }))
         .catch(error => res.status(400).json({ error }));
   } else if (like === -1) {  // Je n'aime pas
      Sauce.updateOne({ _id:req.params.id }, { $push: { usersDisliked: userId }, $inc: { dislikes: +1 } })
         .then(() => res.status(200).json({ message: "Vous n'avez pas aimé la sauce !" }))
         .catch(error => res.status(400).json({ error }));
   } else {  // Je n'ai plus d'avis
      Sauce.findOne({ _id: req.params.id })
         .then(sauce => {
            if (sauce.usersLiked.includes(userId)) {
               Sauce.updateOne({ _id:req.params.id }, { $pull: { usersLiked: userId }, $inc: { likes: -1 } })
                  .then(() => res.status(200).json({ message: "Vote annulé"}))
                  .catch(error => res.status(400).json({ error }))
            } else if (sauce.usersDisliked.includes(userId)) {
               Sauce.updateOne({ _id:req.params.id }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } })
                  .then(() => res.status(200).json({ message: "Vote annulé"}))
                  .catch(error => res.status(400).json({ error }))
            }
         })
         .catch(error => res.status(400).json({ error }));
   }
 };