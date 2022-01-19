const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoClient = require("mongodb").MongoClient;

app.use(bodyParser.urlencoded({ extended: true }));

var connectionString =
  "mongodb+srv://aadil1:aadil123@cluster0.zehbr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoClient
  .connect(connectionString, {
    useUnifiedTopology: true,
  })
  .then((client) => {
    console.log("Connected to database");
    const db = client.db("inventory-db");
    const collection = db.collection("inventory");
    app.get("/", (req, res) => {
      res.sendFile(__dirname + "/main.html");
    });

    app.get("/addproduct", (req, res) => {
      res.sendFile(__dirname + "/addproduct.html");
    });

    app.post("/addproduct", (req, res) => {
      collection
        .insertOne(req.body)
        .then((result) => {
          console.log(result);
          res.redirect("/");
        })
        .catch((error) => console.error(error));
    });
    app.listen(5000, () => {
      console.log("Server Started");
    });
  })
  .catch((err) => {
    console.log(err);
  });
