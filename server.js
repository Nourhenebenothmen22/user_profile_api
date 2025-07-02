const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Middlewares de sécurité
app.use(helmet());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(mongoSanitize());
app.use(xss());

// Body parser
app.use(express.json());
PORT=process.env.PORT||3000
connectDB()
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});