require("dotenv").config({ path: "../dotenv.env" });
const bodyParse = require("body-parser");
const moment = require("moment");
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const knex = require("knex");
const nodemailer = require("nodemailer");
const app = express();
const apiData = require("./controllers/apiData");
app.use(bodyParse.json());
app.use(cors());
const api = process.env.API_SERVER;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
});
let emailTime = "";
function timeForMail() {
  return (emailTime = moment().format("ll HH:mm"));
}
const mailOptions = {
  from: process.env.EMAIL,
  to: process.env.EMAIL_REC,
  subject: "Issue with the API server",
  text: "There is an issue with API server since" + emailTime
};

const db = knex({
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATA
  }
});

app.get("/", (req, res) => {
  apiData.handleApi(req, res, db);
});

function mail() {
  timeForMail();
  transporter.sendMail(mailOptions, function(error, info) {
    console.log("Email sent: " + info.response);
  });
}

let frontEndTime = "";
let delayTime = "";
let checkTime = moment().format();

const getData = setInterval(function() {
  const start = new Date();
  axios
    .get(api)
    .then(response => {
      const status = response.data["status"];
      if (status !== "ok" && checkTime > delayTime) {
        delayTime = moment()
          .add(1, "hour")
          .format();
        return mail();
      } else {
        console.log("No email was sent");
      }
      let isReady = true;
      if (status !== "ok" && isReady === true) {
        frontEndTime = moment().format("ll HH:mm");
        return (isReady = false);
      } else if (status === "ok") {
        isReady = true;
      }
      const finish = new Date();
      const result = finish.getTime() - start.getTime();
      db("connections_api")
        .insert({
          status: status === "ok" ? true : false,
          time: result
        })
        .then(console.log);
    })
    .catch(err => res.status(400).json("Connection failed"));
}, 300000);

app.get("/time", function(req, res) {
  res.send(JSON.stringify(frontEndTime));
});

app.listen(3001);
