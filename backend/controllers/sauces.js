const Sauce = require("../models/sauces");
const mongoose = require("mongoose");
const fs = require("fs");

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
      .catch(error => { res.status(400).json( { error })});
};

exports.getOneSauce = (req, res) => {
   Sauce.findOne({ _id: req.params.id })
     .then(sauce => res.status(200).json(sauce))
     .catch(error => res.status(404).json({ error }));
};

exports.modifySauce = (req, res) => {
   const sauceObject = req.file ? {
       ...JSON.parse(req.body.sauce),
       imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
   } : { ...req.body };
   // console.log(("userId: ", sauceObject.userId), ("id: ", req.params.id));
   Sauce.findOne({_id: req.params.id})
      .then((sauce) => {
         if (sauce.userId != req.auth.userId) {
            res.status(401).json({ message : 'Non autorisé'});
         } else {
            Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
               .then(() => res.status(200).json({message : 'Sauce modifiée !'}))
               .catch(error => res.status(401).json({ error }));
         }
      })
      .catch((error) => {
         res.status(400).json({ error });
      });
};

exports.deleteSauce = (req, res) => {
   Sauce.findOne({ _id: req.params.id})
       .then(sauce => {
           if (sauce.userId != req.auth.userId) {
               res.status(401).json({message: 'Non autorisé'});
           } else {
               const filename = sauce.imageUrl.split('/images/')[1];
               fs.unlink(`images/${filename}`, () => {
                   Sauce.findByIdAndDelete({_id: req.params.id})
                       .then(() => { res.status(200).json({message: 'Sauce supprimée !'})})
                       .catch(error => res.status(401).json({ error }));
               });
           }
       })
       .catch( error => {
           res.status(500).json({ error });
       });
};
// exports.deleteSauce = (req, res) => {
//    console.log((req.params), ("id: ", req.body.id));
//    Sauce.findByIdAndDelete({ _id: req.params.id, imageUrl: req.body.imageUrl })
//    .then(() => {
//       console.log(req.params);
//       res.status(200).json({ message: 'Sauce supprimée !'})
//    })
//    .catch(error => res.status(400).json({ error }));
//    console.log(req.body.sauce, req.body, req.prams);
// };

// exports.deletePhoto = (req, res) => {
//    Sauce.deleteOne({ imageUrl: req.params.imageUrl })
//       .then(() => res.status(200).json({ message: 'photo supprimée !'}))
//       .catch(error => res.status(400).json({ error }));
// }

exports.didUserlike = (req, res) => {
   const { like, userId} = req.body
   console.log(like, userId);
   if (![0, -1, 1].includes(like)) return
   else (res.status(200));
   Sauce.findOne(req, res)
     .then(sauce => res.status(200).json(sauce))
     .catch(error => res.status(404).json({ error }));
//    console.log("like/dislike !");
};