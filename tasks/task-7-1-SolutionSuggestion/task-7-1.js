const express = require('express');
const app = express();
const port = 3000;

app.get('/public', (request, response) => {
  response.send('Public endpoint');
});

app.get('/private', (request, response) => {
  if (!request.headers.authorization) {
    response.status(401).header({
      "WWW-Authenticate": 'Basic realm="Authenticate yourself!"'
    }).send();
  } else {
    const credentials = atob(request.headers.authorization.replace("Basic ", "")).split(":");
    if (credentials[0] === "zli" && credentials[1] === "zli1234") {
      response.send("Private endpoint");
    } else {
      response.send(401);
    }
  }
});

app.listen(port, () => {
  console.log(`Auth app listening on port ${port}`);
});