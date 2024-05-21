const express = require('express');
const app = express();

app.use(express.json());

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

// Book routes
app.get("/books", (request, response) => {
  const booksOverview = books.map(book => ({ isbn: book.isbn, title: book.title }));
  response.json(booksOverview);
});

app.get("/books/:isbn", (request, response) => {
  const isbn = request.params.isbn;
  const book = books.find(b => b.isbn == isbn);

  if (!book) return response.sendStatus(404);

  response.json(book);
});

app.post("/books", (request, response) => {
  const newBook = request.body;

  if (isValid(newBook)) {
    books.push(newBook);
    response.json(newBook);
  } else {
    response.sendStatus(422);
  }
});

app.delete("/books/:isbn", (request, response) => {
  const isbn = request.params.isbn;
  const bookIndex = books.findIndex(b => b.isbn == isbn);

  if (bookIndex < 0) {
    return response.sendStatus(404);
  }
  books.splice(bookIndex, 1);
  response.sendStatus(204);
});

app.put("/books/:isbn", (request, response) => {
  const isbn = request.params.isbn;
  const bookIndex = books.findIndex(b => b.isbn == isbn);
  const bookToUpdate = request.body;

  if (bookIndex < 0) {
    return response.sendStatus(404);
  }
  if (!isValid(bookToUpdate)) {
    return response.sendStatus(422);
  }

  books.splice(bookIndex, 1, bookToUpdate);
  response.status(200).json(bookToUpdate);
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

// Lend routes
app.get("/lends", (request, response) => {
  response.json(lends);
});

app.get("/lends/:id", (request, response) => {
  const lend = lends.find(l => l.id == request.params.id);

  if (!lend) return response.sendStatus(404);

  response.json(lend);
});

app.post("/lends", (request, response) => {
  const newLend = request.body;
  newLend.id = lends.length + 1;
  newLend.borrowed_at = new Date().toISOString();
  newLend.returned_at = null;

  if (!isValidLend(newLend)) return response.sendStatus(422);

  lends.push(newLend);
  response.json(newLend);
});

app.patch("/lends/:id", (request, response) => {
  const lendIndex = lends.findIndex(lend => lend.id == request.params.id);

  if (lendIndex < 0) return response.sendStatus(404);

  const updateParams = (({ isbn, customer_id, returned_at }) => ({ isbn, customer_id, returned_at }))(request.body);
  const updatedLend = { ...lends[lendIndex], ...updateParams };

  if (!isValidLend(updatedLend)) return response.sendStatus(422);
  if (!isLendable(updatedLend)) return response.sendStatus(422);

  lends.splice(lendIndex, 1, updatedLend);
  response.json(updatedLend);
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
