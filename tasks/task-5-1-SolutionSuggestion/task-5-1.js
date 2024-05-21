const express = require('express')
const app = express()

app.use(express.json())

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
    author: 'Frank SchÃ¤tzing',
    year: 2004
  }
]

app.get("/books", (request, response) => {
	const booksOverview = books.map(book => ({ isbn: book.isbn, title: book.title }))
	response.json(booksOverview)
})

app.get("/books/:isbn", (request, response) => {
	const isbn = request.params.isbn
	const book = books.find(b => b.isbn == isbn)

	if(!book) return response.sendStatus(404)

	response.json(book)
})

app.post("/books", (request, response) => {
	const newBook = request.body

	if(isValid(newBook)) {
		books.push(newBook)
		response.json(newBook)
	} else {
		response.sendStatus(422)
	}
})

app.delete("/books/:isbn", (request, response) => {
	const isbn = request.params.isbn
	const bookIndex = books.findIndex(b => b.isbn == isbn)

	if(bookIndex < 0) {
		return response.sendStatus(404)
	}
	books.splice(bookIndex, 1)
	response.sendStatus(204)
})

app.put("/books/:isbn", (request, response) => {
	const isbn = request.params.isbn
	const bookIndex = books.findIndex(b => b.isbn == isbn)
	const bookToUpdate = request.body

	if(bookIndex < 0) {
		return response.sendStatus(404)
	}
	if(!isValid(bookToUpdate)) {
		return response.sendStatus(422)
	}

	books.splice(bookIndex, 1, bookToUpdate)
	response.status(200).json(bookToUpdate)
})

function isValid(book) {
	return book.isbn != undefined && book.isbn != "" &&
	 book.title != undefined && book.title != "" &&
	 book.author != undefined && book.author != "" &&
	 book.year != undefined && book.year != ""
}

app.listen(3000)