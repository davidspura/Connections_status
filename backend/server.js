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
////POSSIBLE CHANGES IN FUTURE
const nodePort = 3001;
const handleBarkioApi = require("./controllers/handleBarkioApi");
const handleBarkioXmpp = require("./controllers/handleBarkioXmpp");
const barkioXmppDatabase = "barkioxmpp";
const dataFormat = "ll HH:mm";
const barkioApi = process.env.API_SERVER;
const xmppPort = process.env.XMPP_PORT;
const barkioXmpp = process.env.XMPP_SERVER;
const fiveMinutes = 300000;

////SERVER REQUESTS MANAGER
const ServersConnections = [
  //barkio xmppp
  setInterval(function() {
    getXmppData();
  }, fiveMinutes),
  app.get("/barkioXmpp", (req, res) => {
    handleBarkioXmpp.handleBarkioXmpp(req, res, db);
  }),
  //barkio api
  setInterval(function() {
    apiRequest(
      barkioApi /*server adress*/,
      "barkioapi" /*database table name*/
    );
  }, fiveMinutes /*Frequency of check */),
  app.get("/barkioApi", (req, res) => {
    handleBarkioApi.handleBarkioApi(req, res, db);
  })
];

app.use(express.static(path.join(__dirname, "build")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.get("/time", function(req, res) {
  res.send(JSON.stringify(frontEndTime));
});

////DATABASE
const db = knex({
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATA
  }
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
        time: result
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
          time: result
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
      time: result
    })
    .then(console.log);
};

app.listen(nodePort), console.log("server is running");
