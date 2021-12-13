/*
The Bronze Bonus Bash for Choice Coin 
Issue: https://github.com/ChoiceCoin/Voting/issues/933
Run: npm install algo sdk and npm install express
*/
const algosdk = require("algosdk"); //imports algosdk
const express = require("express"); //imports Express
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
require('dotenv').config()

var app = express();
const server = http.createServer(app);

const io = new Server(server);

var PORT = process.env.PORT || 8000; //Declares Port

const baseServer = "https://testnet-algorand.api.purestake.io/idx2"; //define Purestake.io server
const algod_port = "";
const token = {
  "X-API-Key": process.env.API_KEY, //Input Purestake.io Api key here
};

const algodClient = new algosdk.Algodv2(token, baseServer, algod_port); //creates new instance of algosdk

io.on("connection", (socket) => {
  //creates socket connection
  console.log("a user connected");
  socket.on("vote", (color) => {
    //gets vote from user and calls the vote function then returns trans id
    var result = vote(color).then((res) => {
      socket.emit("result", res);
    });
  }); //run vote
});

app.use("/static", express.static(path.join(__dirname, "static")));

async function vote(user_input) {
  var resu;
  const params = await algodClient.getTransactionParams().do(); //get transaction params

  if (user_input == "red") {
    //Draft Asset Transfer Transaction
    const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: button_address,
      to: red_address,
      amount: amount,
      assetIndex: asset_id,
      suggestedParams: {
        note: "Sent to address zero",
        type: "axfer", // ASA Transfer (axfer)
        fee: params.fee,
        firstRound: params.firstRound,
        lastRound: params.lastRound,
        genesisID: params.genesisID,
        genesisHash: params.genesisHash,
        flatFee: params.flatFee,
      },
    });

    // Sign transaction with the address two secret key
    const signedTxn = txn.signTxn(button_address_phrase.sk);
    //send signed transaction
    const result = await algodClient.sendRawTransaction(signedTxn).do();

    resu = {
      message: `Sent to Red Address, Your Transaction ID: ${result.txId}`,
      transaction_id: result.txId,
    };
  } else if (user_input == "blue") {
    //Draft Asset Transfer transaction
    const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: button_address,
      to: blue_address,
      amount: amount,
      assetIndex: asset_id,
      suggestedParams: {
        note: "Sent to Blue address",
        type: "axfer", // ASA Transfer (axfer)
        fee: params.fee,
        firstRound: params.firstRound,
        lastRound: params.lastRound,
        genesisID: params.genesisID,
        genesisHash: params.genesisHash,
        flatFee: params.flatFee,
      },
    });

    // sign transaction with address two secretkey
    const signedTxn = txn.signTxn(button_address_phrase.sk);
    //Send signed Transaction
    const result = await algodClient.sendRawTransaction(signedTxn).do();

    resu = {
      message: `Sent to Blue Address, Your Transaction ID: ${result.txId}`,
      transaction_id: result.txId,
    };
  }
  console.log(resu);
  return resu;
}


const asset_id = 21364625;
const button_address = ""; //Put address two private key here
const blue_address = ""; //Put address one private key here
const red_address = ""; //Put address zero private key here

const amount = 100;

// const button_address_phrase = algosdk.mnemonicToSecretKey(""); //Put address two Mnemonic Phrase here

app.get('/', (req, res)=>{
  res.sendFile(path.join(__dirname, '/templates/index.html'))
})


app.listen(PORT);
console.log("Server running on port " + PORT + "...");
