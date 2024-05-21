const express = require('express');
const session = require('express-session');
const booksRouter = require('./routes/books');
const lendsRouter = require('./routes/lends');
const authRouter = require('./routes/auth').router; // Importiere nur den Router
const { isAuthenticated } = require('./routes/auth'); // Importiere die Middleware-Funktion

const app = express();

app.use(express.json());
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // secure should be true in production with HTTPS
}));

// Use routers
app.use('/books', booksRouter);
app.use('/lends', lendsRouter);
app.use('/auth', authRouter);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
