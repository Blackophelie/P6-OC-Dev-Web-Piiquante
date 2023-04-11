const jwt = require('jsonwebtoken');
 
module.exports = (req, res, next) => {
    try {
        // Récupère la valeur du token après Bearer dans le header Authorization
        const token = req.headers.authorization.split(' ')[1];

        // Verifier que le token correspond
        const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
        
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
	    next();
    } catch(error) {
        res.status(401).json({ error });
    }
};