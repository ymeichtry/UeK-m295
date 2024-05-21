const express = require('express');
const session = require('express-session');

const app = express();

app.use(express.json());
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }, // secure should be true in production with HTTPS
}));

// Dummy credentials
const validEmail = 'desk@library.example';
const validPassword = 'm295';

const books = [
  {
    isbn: '9783453318789',
    title: 'Der Nasse Fisch',
    author: 'Volker Kutscher',
    year: 2008,
  },
  {
    isbn: '9783552059087',
    title: 'Gone Girl - Das perfekte Opfer',
    author: 'Gillian Flynn',
    year: 2012,
  },
  {
    isbn: '9783257237274',
    title: 'Der Schwarm',
    author: 'Frank Schätzing',
    year: 2004,
  },
];

// Middleware to protect Lend routes
function isAuthenticated(req, res, next) {
  if (req.session.isAuthenticated) {
    next();
  } else {
    res.sendStatus(401);
  }
}

// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email === validEmail && password === validPassword) {
    req.session.isAuthenticated = true;
    req.session.email = email;
    res.status(201).json({ email });
  } else {
    res.sendStatus(401);
  }
});

// Verify endpoint
app.get('/verify', (req, res) => {
  if (req.session.isAuthenticated) {
    res.status(200).json({ email: req.session.email });
  } else {
    res.sendStatus(401);
  }
});

// Logout endpoint
app.delete('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.sendStatus(204);
    }
  });
});

// Book routes
app.get('/books', (req, res) => {
  const booksOverview = books.map((book) => ({ isbn: book.isbn, title: book.title }));
  res.json(booksOverview);
});

// eslint-disable-next-line consistent-return
app.get('/books/:isbn', (req, res) => {
  const { isbn } = req.params;
  // eslint-disable-next-line eqeqeq
  const book = books.find((b) => b.isbn == isbn);

  if (!book) return res.sendStatus(404);

  res.json(book);
});

app.post('/books', (req, res) => {
  const newBook = req.body;

  // eslint-disable-next-line no-use-before-define
  if (isValid(newBook)) {
    books.push(newBook);
    res.json(newBook);
  } else {
    res.sendStatus(422);
  }
});

// eslint-disable-next-line consistent-return
app.delete('/books/:isbn', (req, res) => {
  const { isbn } = req.params;
  // eslint-disable-next-line eqeqeq
  const bookIndex = books.findIndex((b) => b.isbn == isbn);

  if (bookIndex < 0) {
    return res.sendStatus(404);
  }
  books.splice(bookIndex, 1);
  res.sendStatus(204);
});

// eslint-disable-next-line consistent-return
app.put('/books/:isbn', (req, res) => {
  const { isbn } = req.params;
  // eslint-disable-next-line eqeqeq
  const bookIndex = books.findIndex((b) => b.isbn == isbn);
  const bookToUpdate = req.body;

  if (bookIndex < 0) {
    return res.sendStatus(404);
  }
  // eslint-disable-next-line no-use-before-define
  if (!isValid(bookToUpdate)) {
    return res.sendStatus(422);
  }

  books.splice(bookIndex, 1, bookToUpdate);
  res.status(200).json(bookToUpdate);
});

function isValid(book) {
  // eslint-disable-next-line eqeqeq
  return book.isbn != undefined && book.isbn != ''
    // eslint-disable-next-line eqeqeq
    && book.title != undefined && book.title != ''
    // eslint-disable-next-line eqeqeq
    && book.author != undefined && book.author != ''
    // eslint-disable-next-line eqeqeq
    && book.year != undefined && book.year != '';
}

const lends = [
  {
    id: 1,
    isbn: '9783552059087',
    customer_id: 1,
    borrowed_at: new Date().toISOString(),
    returned_at: null,
  },
];

// Lend routes (protected)
app.get('/lends', isAuthenticated, (req, res) => {
  res.json(lends);
});

// eslint-disable-next-line consistent-return
app.get('/lends/:id', isAuthenticated, (req, res) => {
  // eslint-disable-next-line eqeqeq
  const lend = lends.find((l) => l.id == req.params.id);

  if (!lend) return res.sendStatus(404);

  res.json(lend);
});

// eslint-disable-next-line consistent-return
app.post('/lends', isAuthenticated, (req, res) => {
  const newLend = req.body;
  newLend.id = lends.length + 1;
  newLend.borrowed_at = new Date().toISOString();
  newLend.returned_at = null;

  // eslint-disable-next-line no-use-before-define
  if (!isValidLend(newLend)) return res.sendStatus(422);

  lends.push(newLend);
  res.json(newLend);
});

// eslint-disable-next-line consistent-return
app.patch('/lends/:id', isAuthenticated, (req, res) => {
  // eslint-disable-next-line eqeqeq
  const lendIndex = lends.findIndex((lend) => lend.id == req.params.id);

  if (lendIndex < 0) return res.sendStatus(404);

  // eslint-disable-next-line max-len, camelcase
  const updateParams = (({ isbn, customer_id, returned_at }) => ({ isbn, customer_id, returned_at }))(req.body);
  const updatedLend = { ...lends[lendIndex], ...updateParams };

  // eslint-disable-next-line no-use-before-define
  if (!isValidLend(updatedLend)) return res.sendStatus(422);
  // eslint-disable-next-line no-use-before-define
  if (!isLendable(updatedLend)) return res.sendStatus(422);

  lends.splice(lendIndex, 1, updatedLend);
  res.json(updatedLend);
});

function isValidLend(lend) {
  // eslint-disable-next-line eqeqeq
  return lend.isbn != undefined && lend.isbn != ''
    // eslint-disable-next-line eqeqeq
    && lend.customer_id != undefined && lend.customer_id != ''
    // eslint-disable-next-line eqeqeq
    && lend.borrowed_at != undefined && lend.borrowed_at != ''
    // eslint-disable-next-line no-restricted-globals
    && (lend.returned_at == null || !isNaN(Date.parse(lend.returned_at)));
}

function isLendable(lend) {
  let customerLends = 0;
  let bookLends = 0;

  lends.forEach((otherLend) => {
    // eslint-disable-next-line eqeqeq, no-plusplus
    if (lend.isbn == otherLend.isbn && otherLend.returned_at == null) bookLends++;
    // eslint-disable-next-line eqeqeq, no-plusplus
    if (lend.customer_id == otherLend.customer_id && otherLend.returned_at == null) customerLends++;
  });

  return customerLends <= 3 && bookLends < 1;
}

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
