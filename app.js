const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

// Sécurisation
const helmet = require("helmet");  // Helmet helps you secure your Express apps by setting various HTTP headers. It's not a silver bullet, but it can help!
const mongoSanitize = require('express-mongo-sanitize'); // Supprime $ et . au début des clés des objets de requêtes req.body, req.query or req.params



const dotenv = require("dotenv"); // Pour acceder au variables d'environnement
dotenv.config();


const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');


const app = express();

app.use(express.json()); // Parse req.body en JSON
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(mongoSanitize());


mongoose.set('strictQuery', false); // DeprecationWarning: Mongoose: the `strictQuery` option will be switched back to `false` by default in Mongoose 7

// Connection à MongoDb - OP
mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@piiquante.doqdqqn.mongodb.net/?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'piiquante'
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// A voir si besoin, eliminie les erreurs CORS - OP
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});




//Routes
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));


module.exports = app;