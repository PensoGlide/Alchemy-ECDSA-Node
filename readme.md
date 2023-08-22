## ECDSA Node

This project is an example of using a client and server to facilitate transfers between different addresses. Since there is just a single server on the back-end handling transfers, this is clearly very centralized. We won't worry about distributed consensus for this project.

However, something that we would like to incoporate is Public Key Cryptography. By using Elliptic Curve Digital Signatures we can make it so the server only allows transfers that have been signed for by the person who owns the associated address.

### Implementation
The current project uses ECDSA, more specifically `secp256k1` signatures in order to send a transaction. For that purpose, you could either use your own key pair and simply provide a valid signature or you could create your own keypair and signatures with the provided scripts under the 'server' codebase, more specifically `./scripts`, where you can find the `createPairs.js` and `signMessages.js`.

The signature the server is expecting is one that contains a message derived by the `keccak256` of `Send amount + Recipient Address`.


If your opted to use our scripts:
- `createPairs.js`

This file exists in order to ease the creation of key pairs, once more, using the `secp256k1` curve of the ECDSA algorithm, that is stored under the `.keypairs.json`.

- `signMessages.js`
  
In order to easily sign the messages, this script was created. This function expects your `publicKey`, `amount` and `recipient`, being these last two a number and an hexadecimal address, respectively. For the addresses, you can provide the "0x" common to hexadecimal notation or not. The script then searches for your keypair on the `.keypairs.json`, generates a message hash by computing the `keccak256` of `amount + recipient` and finally returns your signature in hexadecimal notation for you to provide in the frontend "Signature Hexadecimal".


### Video instructions
For an overview of this project as well as getting started instructions, check out the following video:

https://www.loom.com/share/0d3c74890b8e44a5918c4cacb3f646c4
 
### Client

The client folder contains a [react app](https://reactjs.org/) using [vite](https://vitejs.dev/). To get started, follow these steps:

1. Open up a terminal in the `/client` folder
2. Run `npm install` to install all the depedencies
3. Run `npm run dev` to start the application 
4. Now you should be able to visit the app at http://127.0.0.1:5173/

### Server

The server folder contains a node.js server using [express](https://expressjs.com/). To run the server, follow these steps:

1. Open a terminal within the `/server` folder 
2. Run `npm install` to install all the depedencies 
3. Run `node index` to start the server 

The application should connect to the default server port (3042) automatically! 

_Hint_ - Use [nodemon](https://www.npmjs.com/package/nodemon) instead of `node` to automatically restart the server on any changes.
