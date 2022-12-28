const express = require("express");
const app = express();
const cors = require("cors");
const {toHex} = require("ethereum-cryptography/utils");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "045d99a6b675388b6b501f9d9925cc20a24db2f74cf6e224b82072b13643d84be22507a4aff475792400fb775bcd1bd54fd5815ac95789a74a9b5a2d5b069a3e3e": 100,
  "042284a5972f7f9a22605f2309724654813fab4c066d5dce85bf3930e888ea4747e6ab5a42c3eac445fe006413bc5b5ffdd9b3b116de33d1431de167505a9c2922": 50,
  "04aa2f78a782b090ac99536e538d47322c1cc72af5f735dbf2c41fc698bdecaa3b4a58f64de51c5ef63664faa0c28d6d70af78f11d5899ffb5f0cbbef8edff1668": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });

});

app.post("/send", (req, res) => {
  //TODO: get asignature from client side application
  // Recover public address from signature
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
