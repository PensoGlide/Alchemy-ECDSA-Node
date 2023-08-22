const { secp256k1 } = require("ethereum-cryptography/secp256k1.js");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const { keccak256, keccak224, keccak384, keccak512 } = require("ethereum-cryptography/keccak.js");
const fs = require("fs");
const path = require('path');
const keyPairs = require('../keypairs.json');

function main(pubKey, amount, recipient) {
    // Strips "0x" from hexadecimal addresses
    if (pubKey.slice(0, 2) === "0x") {
        pubKey = pubKey.slice(2);
    }
    if (recipient.slice(0, 2) === "0x") {
        recipient = recipient.slice(2);
    }

    const data = keyPairs;

    let keyPair;
    for (let obj of data) {
        if (obj.publicKey === pubKey) {
            keyPair = obj;
        }
    }
    if (!keyPair) {
        throw('No such public key was found');
    }

    const messageHash = keccak256(utf8ToBytes(amount + recipient));
    const signature = secp256k1.sign(messageHash, keyPair.privateKey);
    console.log("Your signature is the following:");
    console.log(signature.toCompactHex());
    console.log("To send a transaction, simply provide the 'r' and 's' parameters in the frontend")
}

try {
    main("02f3899afb4b738878a4c10091c78277776bc572860d634a16e15d06120cdeb741", "5", "0x1")
} catch (error) {
    console.log(error);
}