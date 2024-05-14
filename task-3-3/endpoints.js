const express = require("express");
const app = express();
const port = 3000;

app.get("/", (request, response) => {
  response.send("Hello World!");
});

app.get("/now", (request, response) => {
  const date = new Date();
  response.send(date.toLocaleString());
});

app.get("/zli", (request, response) => {
  response.redirect("https://www.zli.ch");
});

const nameList = [
  "Anna",
  "Boris",
  "Claudia",
  "David",
  "Emma",
  "Felix",
  "Greta",
  "Hans",
  "Ingrid",
  "Jan",
  "Klara",
  "Lukas",
  "Maria",
  "Nico",
  "Olivia",
  "Paul",
  "Quentin",
  "Rita",
  "Simon",
  "Tina",
];

app.get("/name", (request, response) => {
  const index = Math.floor(Math.random() * nameList.length);
  const randomName = nameList[index];
  response.send(randomName);
});

app.get("/html", (request, response) => {
  response.sendFile("/workspaces/m295/task-3-3/endpoint.html");
});

app.get("/image", (request, response) => {
  response.sendFile("/workspaces/m295/task-3-3/endpoint.png");
});

app.get("/teapot", (request, response) => {
  response.status(418).send("I'm a teapot");
});

app.get("/user-agent", (request, response) => {
  response.send(request.headers["user-agent"]);
});

app.get("/secret", (request, response) => {
  response.status(403).send("I am secret");
});

app.get("/xml", (request, response) => {
  response.sendFile("/workspaces/m295/task-3-3/endpoint.xml");
});

app.get("/me", (request, response) => {
  response.sendFile("/workspaces/m295/task-3-3/endpoint.json");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
