var fs = require("fs");
var express = require("express");
var cryptor = require("crypto");
var sign = cryptor.createSign("RSA-SHA256");
var bodyParser = require("body-parser");

var testrsa = express();

testrsa.use(
  bodyParser.urlencoded({
    extended: true
  })
);
testrsa.use(bodyParser.json());

data = { id: "1", battery_charge: "35" };
fake = { id: "2", battery_charge: "35" };

//sign.update("some data to sign");
console.log("data: ", JSON.stringify(data));
sign.update(JSON.stringify(data));
var privateKey = fs.readFileSync("./sk.pem", "utf8");
var signedData = sign.sign(privateKey, "base64");

var verify = cryptor.createVerify("RSA-SHA256");
//verify.write("some data to sigan");
verify.write(JSON.stringify(fake));
verify.end();
var publicKey = fs.readFileSync("./pk.pem", "utf8");
console.log(verify.verify(publicKey, signedData, "base64"));
