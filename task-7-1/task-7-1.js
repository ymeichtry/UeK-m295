const express = require("express");
const dotenv = require("dotenv");
const app = express();
const port = 3000;

dotenv.config();

const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;

app.get("/", (request, response) => {
  response.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.get("/public", (request, response) => {
  response.send("Hello public!");
});

const basicAuth = (request, response, next) => {
  const authHeader = request.headers["authorization"];

  if (!authHeader) {
    response.setHeader("WWW-Authenticate", 'Basic realm="401"');
    return response.status(401).send("Authorization required");
  }

  const auth = Buffer.from(authHeader.split(" ")[1], "base64")
    .toString()
    .split(":");
  const user = auth[0];
  const pass = auth[1];

  if (user === USERNAME && pass === PASSWORD) {
    return next();
  } else {
    response.setHeader("WWW-Authenticate", 'Basic realm="401"');
    return response.status(403).send("Forbidden");
  }
};

app.get("/private", basicAuth, (req, res) => {
  res.send("Hello private!");
});
