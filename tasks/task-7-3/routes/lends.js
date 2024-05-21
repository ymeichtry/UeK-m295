const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('./auth');

let lends = [
  {
    id: 1,
    isbn: "9783552059087",
    customer_id: 1,
    borrowed_at: new Date().toISOString(),
    returned_at: null
  }
];

router.get("/", isAuthenticated, (req, res) => {
  res.json(lends);
});

router.get("/:id", isAuthenticated, (req, res) => {
  const lend = lends.find(l => l.id == req.params.id);

  if (!lend) return res.sendStatus(404);

  res.json(lend);
});

router.post("/", isAuthenticated, (req, res) => {
  const newLend = req.body;
  newLend.id = lends.length + 1;
  newLend.borrowed_at = new Date().toISOString();
  newLend.returned_at = null;

  if (!isValidLend(newLend)) return res.sendStatus(422);

  lends.push(newLend);
  res.json(newLend);
});

router.patch("/:id", isAuthenticated, (req, res) => {
  const lendIndex = lends.findIndex(lend => lend.id == req.params.id);

  if (lendIndex < 0) return res.sendStatus(404);

  const updateParams = (({ isbn, customer_id, returned_at }) => ({ isbn, customer_id, returned_at }))(req.body);
  const updatedLend = { ...lends[lendIndex], ...updateParams };

  if (!isValidLend(updatedLend)) return res.sendStatus(422);
  if (!isLendable(updatedLend)) return res.sendStatus(422);

  lends.splice(lendIndex, 1, updatedLend);
  res.json(updatedLend);
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

module.exports = router;
