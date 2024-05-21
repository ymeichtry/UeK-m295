const express = require('express');
const app = express();
const port = 3000;
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger-output.json' assert {type: 'json'};

import swaggerAutogen from 'swagger-autogen';
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');


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

let lends=[
    {
      "id": "123",
      "customer_id": "1",
      "isbn": "978-3-16-148418-8",
      "borrowed_at": "2024-04-14T08:00:00Z",
      "returned_at": null
    }  
  ];


//books

app.get('/books', (request, response) => {
    response.send(books);
  });
  
  app.get('/books/:isbn', (request, response) => {
    const isbn =request.params.isbn
    response.send(books.find((book) => book.isbn === isbn));
  });
  
  app.post('/books',(request, response) => {
    books = [...books, request.body]
    response.send(request.body)
  });
  
  app.put('/books/:isbn',(request, response) => {
    books = books.map((book)=> book.isbn === request.params.isbn ? request.body :book);
    response.send(books)
  });
  
  app.delete('/books/:isbn',(request, response) => {
    books = books.filter((book)=> book.isbn !== request.params.isbn);
    response.send(books)
  });
  
  app.patch('/books/:isbn', (request, response) => {
    const isbn = request.params;
    const updatedBook = request.body;
    books = books.map((book) => (book.isbn === isbn ? { ...book, ...updatedBook } : book));
    response.send(books);
  });
  
  app.get('/lends', (request, response) => {
    response.send(lends);
  });
  
  app.get('/lends/:id', (request, response) => {
    response.send(lends.find((lend) => lend.id === request.params.id));
  });
  
  app.post('/lends', (request, response) =>{
    const completBook = {...request.body, id: uuidv4(), borrowed_at: new Date().toLocaleString('de-CH'), returned_at: null}
    lends = [...lends, completBook]
    response.send(completBook)
  })
  
  app.delete('/lends/:id',(request, response) => {
    const lend = lends.find((lend) => lend.id === request.params.id)
    const lendReturned = {...lend, returned_at: new Date().toLocaleString('de-CH')}
    console.log(lendReturned)
    lends = lends.map((book) => (book.id === request.params.id ? { ...book, ...lendReturned } : book));
    response.send(lends)
  });
  

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
  

const outputFiles = './swagger-output.json'