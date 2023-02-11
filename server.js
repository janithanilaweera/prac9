var express = require("express");
var app = express();
var cors = require("cors");

let http = require("http").createServer(app);
let io = require("socket.io")(http);

let accountModel = require("./models/account");

var cons = require("dotenv").config();

let balanceRoutes = require("./routes/balanceRoutes");
let transactionRoutes = require("./routes/transactionRoutes");
let customerRoutes = require("./routes/customerRoutes");
let accountRoutes = require("./routes/accountRoutes");
let depositRoute = require("./routes/depositRoute");

app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use("/api/customer", customerRoutes);
app.use("/api/balance", balanceRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/account", accountRoutes);
app.use("/api/deposit/", depositRoute);

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

var port = process.env.port || 3000;
app.listen(port, () => {
  console.log("App listening to: " + port);
});
const dotenv = require("dotenv");
const buf = Buffer.from("BASIC=basic");
const config = dotenv.parse(buf); // will return an object
console.log(typeof config, config); // object { BASIC : 'basic' }

app.get("/api/checkaccount", (req, res) => {
  accountModel.getCheckAccount(req.query, (err, result) => {
    if (err) res.json({ statusCode: 400, message: err });
    else res.json({ statusCode: 200, data: result, message: "Success" });
  });
});

// This trigers before account transfer function
app.get("/api/checkaccBeforeAcctransfer", (req, res) => {
  accountModel.getCheckaccBeforeAcctransfer((err, result) => {
    if (err) res.json({ statusCode: 400, message: err });
    else res.json({ statusCode: 200, data: result, message: "Success" });
  });
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  setInterval(() => {
    socket.emit("number", parseInt(Math.random() * 5000));
  }, 1000);
});

var port = process.env.port || 3500;

http.listen(port, () => {
  console.log("App listening to: " + port);
});
