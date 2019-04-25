var express = require("express");
var cryptor = require("crypto");
var fs = require("fs");
require("date-utils");
var request = require("request");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/", function(req, res, next) {
  //受信日時出力
  var dt = new Date();
  var formatted = dt.toFormat("YYYYMMDDHH24MISS");

  // リクエストボディを出力
  console.log("body: ", req.body);

  //署名検証
  var verify = cryptor.createVerify("SHA256");
  verify.write(req.body.data);
  verify.end();
  var pk = fs.readFileSync(r_dir + "pks/pk.pem", "utf8");
  var result = verify.verify(pk, req.body.signature, "base64");
  console.log("result: ", result);

  //署名検証結果が正の場合、ファイル格納
  if (result == true) {
    fs.writeFile(
      r_dir + "data_files/11111_" + formatted + ".txt",
      JSON.stringify(req.body)
    );

    // Hyperledger FabricのREST APIを使用してdataとsignatureを書き込む。
    var headers = {
      "Content-Type": "application/json",
      Accept: "application/json"
    };

    var data = {
      $class: "org.example.biznet.Data",
      dataId: "11111_" + formatted,
      data: req.body.data,
      signature: req.body.signature,
      webApp: "resource:org.example.biznet.WebApp#11111"
    };

    var options = {
      url: "http://52.185.138.69:3000/api/org.example.biznet.Data",
      method: "POST",
      headers: headers,
      body: JSON.stringify(data)
    };

    function callback(error, response, body) {
      console.log(response.statusCode);
      if (!error && response.statusCode == 200) {
        console.log(body);
      }
    }

    request(options, callback);
  }

  res.send("POST request to the homepage");
});

module.exports = router;
