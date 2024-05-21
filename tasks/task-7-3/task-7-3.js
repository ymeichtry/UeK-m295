const express = require('express');
const session = require('express-session');

const app = express();

app.use(express.json());
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // secure should be true in production with HTTPS
}));

// Dummy credentials
const validEmail = 'desk@library.example';
const validPassword = 'm295';

let books = [
  {
    isbn: '9783453318789',
    title: 'Der Nasse Fisch',
    author: 'Volker Kutscher',
    year: 2008
  },
  {
    isbn: '9783552059087',
    title: 'Gone Girl - Das perfekte Opfer',
    author: 'Gillian Flynn',
    year: 2012
  },
  {
    isbn: '9783257237274',
    title: 'Der Schwarm',
    author: 'Frank Schätzing',
    year: 2004
  }
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
  req.session.destroy(err => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.sendStatus(204);
    }
  });
});

// Book routes
app.get("/books", (req, res) => {
  const booksOverview = books.map(book => ({ isbn: book.isbn, title: book.title }));
  res.json(booksOverview);
});

app.get("/books/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = books.find(b => b.isbn == isbn);

  if (!book) return res.sendStatus(404);

  res.json(book);
});

app.post("/books", (req, res) => {
  const newBook = req.body;

  if (isValid(newBook)) {
    books.push(newBook);
    res.json(newBook);
  } else {
    res.sendStatus(422);
  }
});

app.delete("/books/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const bookIndex = books.findIndex(b => b.isbn == isbn);

  if (bookIndex < 0) {
    return res.sendStatus(404);
  }
  books.splice(bookIndex, 1);
  res.sendStatus(204);
});

app.put("/books/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const bookIndex = books.findIndex(b => b.isbn == isbn);
  const bookToUpdate = req.body;

  if (bookIndex < 0) {
    return res.sendStatus(404);
  }
  if (!isValid(bookToUpdate)) {
    return res.sendStatus(422);
  }

  books.splice(bookIndex, 1, bookToUpdate);
  res.status(200).json(bookToUpdate);
});

function isValid(book) {
  return book.isbn != undefined && book.isbn != "" &&
    book.title != undefined && book.title != "" &&
    book.author != undefined && book.author != "" &&
    book.year != undefined && book.year != "";
}

let lends = [
  {
    id: 1,
    isbn: "9783552059087",
    customer_id: 1,
    borrowed_at: new Date().toISOString(),
    returned_at: null
  }
];

// Lend routes (protected)
app.get("/lends", isAuthenticated, (req, res) => {
  res.json(lends);
});

app.get("/lends/:id", isAuthenticated, (req, res) => {
  const lend = lends.find(l => l.id == req.params.id);

  if (!lend) return res.sendStatus(404);

  res.json(lend);
});

app.post("/lends", isAuthenticated, (req, res) => {
  const newLend = req.body;
  newLend.id = lends.length + 1;
  newLend.borrowed_at = new Date().toISOString();
  newLend.returned_at = null;

  if (!isValidLend(newLend)) return res.sendStatus(422);

  lends.push(newLend);
  res.json(newLend);
});

app.patch("/lends/:id", isAuthenticated, (req, res) => {
  const lendIndex = lends.findIndex(lend => lend.id == req.params.id);

  if (lendIndex < 0) return res.sendStatus(404);

  const updateParams = (({ isbn, customer_id, returned_at }) => ({ isbn, customer_id, returned_at }))(req.body);
  const updatedLend = { ...lends[lendIndex], ...updateParams };

  if (!isValidLend(updatedLend)) return res.sendStatus(422);
  if (!isLendable(updatedLend)) return res.sendStatus(422);

  lends.splice(lendIndex, 1, updatedLend);
  res.json(updatedLend);
});

function isValidLend(lend) {
  return lend.isbn != undefined && lend.isbn != "" &&
    lend.customer_id != undefined && lend.customer_id != "" &&
    lend.borrowed_at != undefined && lend.borrowed_at != "" &&
    (lend.returned_at == null || !isNaN(Date.parse(lend.returned_at)));
}

function isLendable(lend) {
  let customerLends = 0;
  let bookLends = 0;

  lends.forEach(otherLend => {
    if (lend.isbn == otherLend.isbn && otherLend.returned_at == null) bookLends++;
    if (lend.customer_id == otherLend.customer_id && otherLend.returned_at == null) customerLends++;
  });

  return customerLends <= 3 && bookLends < 1;
}

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
