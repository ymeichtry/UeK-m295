const express = require('express');
const app = express();
const port = 3000;

const books = [
    {
        isbn: "978-3-16-148410-0",
        title: "The Great Gatsby",
        year: 1925,
        author: "F. Scott Fitzgerald"
    },
    {
        isbn: "978-3-16-148411-1",
        title: "To Kill a Mockingbird",
        year: 1960,
        author: "Harper Lee"
    },
    {
        isbn: "978-3-16-148412-2",
        title: "1984",
        year: 1949,
        author: "George Orwell"
    },
    {
        isbn: "978-3-16-148413-3",
        title: "Pride and Prejudice",
        year: 1813,
        author: "Jane Austen"
    },
    {
        isbn: "978-3-16-148414-4",
        title: "The Catcher in the Rye",
        year: 1951,
        author: "J.D. Salinger"
    },
    {
        isbn: "978-3-16-148415-5",
        title: "To the Lighthouse",
        year: 1927,
        author: "Virginia Woolf"
    },
    {
        isbn: "978-3-16-148416-6",
        title: "Moby-Dick",
        year: 1851,
        author: "Herman Melville"
    },
    {
        isbn: "978-3-16-148417-7",
        title: "The Hobbit",
        year: 1937,
        author: "J.R.R. Tolkien"
    },
    {
        isbn: "978-3-16-148418-8",
        title: "Brave New World",
        year: 1932,
        author: "Aldous Huxley"
    }
];

app.get('/books', (request, response) => {
  response.send(books);
});

app.get('/books/:isbn', (request, response) => {
    const book = books.find(book => book.isbn === request.params.isbn);
    if (book) {
        response.send(book);
    } else {
        response.status(404).send('Book not found');
    }
});

app.post('/books', (request, response) => {
    books = []
    
    response.json(newBook);
});

app.put('/books/:isbn', (request, response) => {
    books = books.map(
        (books) => books.isbn === express.request.params.isbn ? express.request.body : book
    );
    express.response.send(request.body);
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
  