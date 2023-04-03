const jwt = require('jsonwebtoken');
const TOKEN_KEY = process.env.TOKEN_KEY;
 
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1]; // recupération du token en utlisant split pour récuépérer uniquement ce qui se trouve après l'espace du mot clé Bearer
       const decodedToken = jwt.verify(token, TOKEN_KEY);
       const userId = decodedToken.userId; // extrait le userId depuis le token
       req.auth = {
           userId: userId
       }; // insère l'userId au champs auth des requêtes qui seront appélées par la suite
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};