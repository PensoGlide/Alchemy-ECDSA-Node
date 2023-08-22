const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const { secp256k1 } = require("ethereum-cryptography/secp256k1.js");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak.js");

app.use(cors());
app.use(express.json());

const balances = {
  "1": 100,
  "2": 50,
  "3": 75,
  "02f3899afb4b738878a4c10091c78277776bc572860d634a16e15d06120cdeb741": 100,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const addressHex = stripHexInitials(address);
  const balance = balances[addressHex] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature } = req.body;
  const senderHex = stripHexInitials(sender);
  const recipientHex = stripHexInitials(recipient);
  const signatureHex = stripHexInitials(signature);

  setInitialBalance(senderHex);
  setInitialBalance(recipientHex);

  // Check if signature is valid against parameters sent
  const signatureVerified = getSignatureVerification(amount, recipientHex, senderHex, signatureHex);

  if (balances[senderHex] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else if (!signatureVerified) {
    res.status(400).send({ message: "Signature does not correspond to parameters given" });
  } else {
    balances[senderHex] -= amount;
    balances[recipientHex] += amount;
    res.send({ balance: balances[senderHex] });
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

function getSignatureVerification(amount, recipient, sender, signature) {
  const messageHash = keccak256(utf8ToBytes(amount + recipient));
  const messageHex = toHex(messageHash);
  const isSigned = secp256k1.verify(signature, messageHex, sender);
  
  return isSigned;
}

// Strips "0x" from hexadecimal strings
function stripHexInitials(hex) {
  if (hex.slice(0, 2) === "0x") {
    hex = hex.slice(2);
  }

  return hex
}