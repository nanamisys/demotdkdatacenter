var express = require("express");
var router = express.Router();
var fs = require("fs");

/* GET users listing. */
router.get("/", function(req, res, next) {
  var fileName = fs.readFileSync(r_dir + "shell/latestShell", "utf8");
  var fileURL = r_dir + "shell/" + fileName;

  res.download(fileURL, function(err) {
    if (err) {
      res.sendStatus(err.status);
      console.log("error.");
    } else {
      console.log("download for shsell done.");
    }
  });

  //res.send("respond with a resource");
});

module.exports = router;
