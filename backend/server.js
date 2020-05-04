require("dotenv").config({ path: "../dotenv.env" });
const bodyParse = require("body-parser");
const moment = require("moment");
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
const knex = require("knex");
const nodemailer = require("nodemailer");
const app = express();
app.use(bodyParse.json());
app.use(cors());
const net = require("net");
let checkTime = moment().format();
let isReadyApi = true;
let isReadyXmpp = true;
let frontEndTime = "";
let delayTime = "";
let start = "";
let finish = "";
let result = "";
let dataArray = [];
app.use(express.static(path.join(__dirname, "build")));
//POSSIBLE CHANGES IN FUTURE
const NODE_PORT = 3001;
const barkioXmppDatabase = "barkioxmpp";
const dataFormat = "ll HH:mm";
const barkioApi = process.env.API_SERVER;
const xmppPort = process.env.XMPP_PORT;
const barkioXmpp = process.env.XMPP_SERVER;
const FIVE_MINUTES = 300000;

//DATABASE
const db = knex({
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATA
  }
});

//DISPLAY NAMES
let namesArray = [
  "API server status",
  "XMPP server status"
]; /*Name of service that will show on frontend 
(must be in same order as bellow, first name will match first called service etc.) */

//BARKIO API
setInterval(function() {
  apiRequest(barkioApi /*server adress*/, "barkioapi" /*database table name*/);
  loadData(db, "barkioapi");
}, FIVE_MINUTES /*Frequency of check */);
initialState(db, "barkioapi");
//BARKIO XMPP
setInterval(function() {
  getXmppData();
  loadData(db, "barkioxmpp");
}, FIVE_MINUTES);
initialState(db, "barkioxmpp");

//INITIAL LOAD OF DATA
async function initialState(db, service) {
  let data = await db
    .select("*")
    .from(service)
    .limit(288)
    .orderBy("id", "desc");
  dataArray.push({ name: data });
}

//DATA TO FRONTEND
async function loadData(db, service) {
  if (numberCheck === 2) {
    dataArray = [];
    numberCheck = 0;
  }
  numberCheck++;
  let data = await db
    .select("*")
    .from(service)
    .limit(288)
    .orderBy("id", "desc");
  dataArray.push({ name: data });
}
let numberCheck = namesArray.length;
//SERVER LINKS FOR FRONTEND
app.get("/dataArray", function(req, res) {
  res.send(JSON.stringify(dataArray));
});

app.get("/namesArray", function(req, res) {
  res.send(JSON.stringify(namesArray));
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.get("/time", function(req, res) {
  res.send(JSON.stringify(frontEndTime));
});
////EMAIL
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
});

const mailOptions = service => {
  return {
    from: process.env.EMAIL,
    to: process.env.EMAIL_REC,
    subject: "Issue with the API server",
    text:
      "There is an issue with " +
      service +
      " since " +
      moment().format(dataFormat)
  };
};

function mail(service) {
  transporter.sendMail(mailOptions(service), function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

//// XMPP CONNECTION
const getXmppData = () => {
  start = new Date();
  const client = new net.Socket();
  client.connect(xmppPort, barkioXmpp, function() {
    console.log("Connected");
    client.write("Checking connection");
  });

  client.on("data", function(data) {
    console.log("Received: " + data);
    isReadyXmpp = true;
    delayTime = "";
    xmppDatabase(connnect => {
      return console.log("Connection successful");
    });
    client.destroy();
  });
  client.on("error", function() {
    xmppDatabase();
    isReadyXmpp = timeAndEmailOnError(process.env.XMPP_SERVER, isReadyXmpp);
    console.log("Error, couldnt connect to the server");
  });
  client.on("close", function() {
    console.log("Connection closed");
  });

  const xmppDatabase = connnect => {
    finish = new Date();
    result = finish.getTime() - start.getTime();
    db(barkioXmppDatabase)
      .insert({
        status: connnect ? true : false,
        time: connnect ? result : 0
      })
      .then(console.log);
  };
};

//// EMAIL AND TIME ON ERROR
const timeAndEmailOnError = (service, ready) => {
  console.log(ready, "READY");
  if (checkTime > delayTime) {
    delayTime = moment()
      .add(1, "hour")
      .format();
    mail(service);
  }
  if (ready === true) {
    console.log(ready, "IF");
    frontEndTime = moment().format(dataFormat);
    return !ready;
  }
};

//// API CONNECTIONS
const apiRequest = (api, database) => {
  start = new Date();
  axios
    .get(api)
    .then(response => {
      isReadyApi = true;
      delayTime = "";
      finish = new Date();
      result = finish.getTime() - start.getTime();
      return getApiData(response, api, database, result);
    })
    .catch(err => {
      finish = new Date();
      result = finish.getTime() - start.getTime();
      console.log("Connection failed");
      db(database)
        .insert({
          status: false,
          time: 0
        })
        .then(console.log);
      isReadyApi = timeAndEmailOnError(api, isReadyApi);
    });
};

const getApiData = (response, api, database, result) => {
  const status = response.data["status"];
  if (status !== "ok" && checkTime > delayTime) {
    delayTime = moment()
      .add(1, "hour")
      .format();
    return mail(api);
  } else {
    console.log("No email was sent");
  }
  isReadyApi = true;
  if (status !== "ok" && isReadyApi === true) {
    frontEndTime = moment().format(dataFormat);
    return (isReadyApi = false);
  } else if (status === "ok") {
    isReadyApi = true;
  }
  db(database)
    .insert({
      status: status === "ok" ? true : false,
      time: status === "ok" ? result : 0
    })
    .then(console.log);
};

app.listen(NODE_PORT), console.log("server is running");
