const express = require('express');
const router = express.Router();

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

router.get("/", (req, res) => {
  const booksOverview = books.map(book => ({ isbn: book.isbn, title: book.title }));
  res.json(booksOverview);
});

router.get("/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = books.find(b => b.isbn == isbn);

  if (!book) return res.sendStatus(404);

  res.json(book);
});

router.post("/", (req, res) => {
  const newBook = req.body;

  if (isValid(newBook)) {
    books.push(newBook);
    res.json(newBook);
  } else {
    res.sendStatus(422);
  }
});

router.delete("/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const bookIndex = books.findIndex(b => b.isbn == isbn);

  if (bookIndex < 0) {
    return res.sendStatus(404);
  }
  books.splice(bookIndex, 1);
  res.sendStatus(204);
});

router.put("/:isbn", (req, res) => {
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

module.exports = router;
