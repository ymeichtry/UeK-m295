const express = require('express');
const session = require('express-session');
const app = express();
const port = 3000;

app.use(express.json());

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.post('/name', (request, response) => {
  const { name } = request.body;
  if (name) {
    request.session.name = name;
    response.status(200).send(`Name '${name}' gespeichert.`);
  } else {
    response.status(400).send('Parameter "name" fehlt.');
  }
});

app.get('/name', (request, response) => {
  if (request.session.name) {
    response.status(200).send(`Gespeicherter Name: ${request.session.name}`);
  } else {
    response.status(404).send('Kein Name in der Session gespeichert.');
  }
});

app.delete('/name', (request, response) => {
  if (request.session.name) {
    delete request.session.name;
    response.status(200).send('Name aus der Session gelöscht.');
  } else {
    response.status(404).send('Kein Name in der Session zu löschen.');
  }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });