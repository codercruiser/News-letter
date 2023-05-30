const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require("https");
const port = 2900;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/sign-up.html");
});

app.get("/success", function (req, res) {
  res.sendFile(__dirname + "/success.html");
});

app.get("/failure", function (req, res) {
  res.sendFile(__dirname + "/failure.html");
});

app.post("/", function (req, res) {
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: fname,
        LNAME: lname,
      },
    }, ],
  };
  const jsonData = JSON.stringify(data);
  const url = "https://us10.api.mailchimp.com/3.0/lists/2ff9c4030d/";

  const options = {
    method: "POST",
    auth: "samuel1:7414b604188568f6a479c58eaa35ffdf-us10",
  };

  const mailchimpRequest = https.request(url, options, function (response) {
    response.on("data", function (data) {
      console.log(JSON.parse(data));
      var respond = response.statusCode;
      console.log(respond);
      if (respond === 200) {
        res.redirect("/success");
      } else {
        res.redirect("/failure");
      }
    });
  });

  mailchimpRequest.write(jsonData);
  mailchimpRequest.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || port, function () {
  console.log(`Server started at port ${port}`);
});
