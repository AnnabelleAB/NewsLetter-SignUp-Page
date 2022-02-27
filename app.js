//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const mailchimp = require('@mailchimp/mailchimp_marketing')
const https = require("https");
const app = express();

//send the signup page to the browser
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});
//enable express to access static files in the folder called "Public"
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

//post data from signup form to mailchimp
app.post("/", function(req, res) {
  //set up variables for input fields on html form
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  //package info received from html form as a JSON in string form
  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };

  const jsonData = JSON.stringify(data);

  //send authenticated data to mailchimp using Node's https package
  const url = "https://us14.api.mailchimp.com/3.0/lists/4334d66572";

  const options = {
    method: "POST",
    auth: "annabelle:fdc9e36176c83dbc6c5ef9e21953d2bc-us14"
  };

  const request = https.request(url, options, function(response) {
    if (response.statusCode == 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", function(req, res) {
  res.redirect("/");
})
//use express to listen on 3000 and dynamicport which heroku will define and log when it's working
app.listen(process.env.PORT || 3000, function(req, res) {
  console.log("Server started on port 3000");
});



// API KEY
// 9c4f259acc7d75b4b794de4d72463d0c-us14
// Audience id
// 4334d66572