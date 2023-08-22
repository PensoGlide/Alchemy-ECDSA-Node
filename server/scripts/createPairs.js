const { secp256k1 } = require("ethereum-cryptography/secp256k1.js");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const { keccak256, keccak224, keccak384, keccak512 } = require("ethereum-cryptography/keccak.js");
const fs = require("fs");
const path = require('path');

function main() {
    const newPrivateKey = secp256k1.utils.randomPrivateKey();
    const newPublicKey = secp256k1.getPublicKey(newPrivateKey);

    const hexPrivateKey = toHex(newPrivateKey);
    const hexPublicKey = toHex(newPublicKey);

    // Verifies if pair is compatible
    const message = "Buenos dias";
    const messageHash = keccak256(utf8ToBytes(message));
    const signature = secp256k1.sign(messageHash, newPrivateKey);
    const isSigned = secp256k1.verify(signature, messageHash, newPublicKey);
    if (!isSigned) {
        throw("The message was signed incorrectly");
    }

    console.log(`Private Key: 0x${hexPrivateKey}`);
    console.log(`Public Key: 0x${hexPublicKey}`);

    // Saves keypair into JSON file
    const keypair = {
        publicKey: hexPublicKey,
        privateKey: hexPrivateKey
    };
    const keyPairString = JSON.stringify(keypair);

    let existingData;
    const filePath = path.join(__dirname, '../keypairs.json');
    console.log(__dirname)
    try {     
        existingData = JSON.parse(fs.readFileSync(filePath, "utf8"));
        console.log('bons dias')
    } catch (error) {
        existingData = [];
        console.log("nope")
    }
    existingData.push(keypair);
    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 4));
}

try {
    main()
} catch (error) {
    console.log(error);
}