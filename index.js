const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoClient = require("mongodb").MongoClient;

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

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
    var items = [];
    app.get("/", (req, res) => {
      //   res.sendFile(__dirname + "/main.html");
      const cursor = db
        .collection("inventory")
        .find({ price: { $ne: null } })
        .toArray()
        .then((results) => {
          console.log(results);
          res.render("main.ejs", { items: results });
        })
        .catch((error) => {
          console.error(error);
        });
    });

    app.post("/updateproduct", (req, res) => {
      console.log("HELLOOOO");
      app.use(bodyParser.json());
      console.log(req.body);
      const cursor = db
        .collection("inventory")
        .findOneAndUpdate(
          { name: req.body.name },
          {
            $set: {
              quantity: req.body.quantity,
              price: req.body.price,
            },
          },
          {
            new: false,
          }
        )
        .then((results) => {
          console.log("RESULT :");
          if (JSON.stringify(results).includes("false") === true) {
            res.redirect("/");
          } else {
            res.redirect("/");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    });

    app.post("/deleteproduct", (req, res) => {
      app.use(bodyParser.json());
      console.log(req.body);
      const cursor = db
        .collection("inventory")
        .deleteOne({ name: req.body.name })
        .then((results) => {
          console.log(results);
          res.redirect("/");
        });
    });

    app.get("/updateproduct", (req, res) => {
      res.sendFile(__dirname + "/updateproduct.html");
    });

    app.get("/addproduct", (req, res) => {
      res.sendFile(__dirname + "/addproduct.html");
    });

    app.get("/deleteproduct", (req, res) => {
      res.sendFile(__dirname + "/deleteproduct.html");
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
