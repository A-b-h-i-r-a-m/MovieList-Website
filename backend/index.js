const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const session = require('express-session');
const authRoutes = require('./routes/userRoutes');
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config();
const PORT = process.env.PORT || 4000;

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Database connected'))
  .catch((err) => console.log(err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false,
}));

app.use(cors({
  origin: 'http://localhost:5173',
  credentials:true
}));

app.use('/', authRoutes);

app.listen(PORT, () => {
  console.log(`App listening at ${PORT}`);
});
