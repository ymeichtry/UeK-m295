const express = require("express");
const app = express();
const port = 3000;
const list = [
  "Adventurous Alice",
  "Brave Brian",
  "Curious Cathy",
  "Daring Dave",
  "Energetic Emma",
  "Fearless Frank",
  "Gentle Gina",
  "Happy Harry",
  "Inquisitive Isabel",
  "Joyful John",
  "Kind Karen",
  "Lively Lisa",
  "Merry Mike",
  "Optimistic Olivia",
  "Playful Peter",
  "Quiet Quin",
  "Radiant Rachel",
  "Spirited Sam",
  "Trusting Tracy",
  "Vibrant Victor",
];
const me = {
  forename: 'Yanis',
  surname: 'Meichtry',
  age: 17
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.get("/now", (request, response) => {
  response.send(
    new Date().toLocaleTimeString("de-CH", { timezone: request.query.tz })
  );
});

app.get("/names", (request, response) => {
  response.send(list);
});

app.post("/names", (request, response) => {
  list.push(request.query.name);
  response.send(`name added ${request.query.name}`);
});

app.delete("/names", (request, response) => {
  const nameindex = list.indexOf(request.query.name);
  list.splice(nameindex, 1);

  response.send(list);
});

app.get("/secret2", (request, response) => {
  const header = request.header("authorization");
  console.log("funktioniert");
  if (header === "Basic aGFja2VyOjEyMzQ=") {
    response.status(200).send("Status 200");
  } else {
    response.status(401).send("Status 401");
  }
});

app.get("/chuck", async (request, response) => {
  const jokeResponse = await fetch(`https://api.chucknorris.io/jokes/random`);
  const jokeJson = await jokeResponse.json();
  response.send(jokeJson.value.replace("Chuck Norris", request.query.name));
});

app.get('/me', (request, response) => {
  response.send(me)
})

app.patch('/me', (request, response) =>{
  response.send(...me, ...request.body);
})

app.get("/", (request, response) => {
  response.send("Hello World!");
});
