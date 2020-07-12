var express = require("express");
var pg = require("pg");
var bodyParser = require("body-parser");
var session = require("express-session");

var CON_STRING = process.env.DB_CON_STRING;
if (CON_STRING == undefined) {
    console.log("Error: Environment variable DB_CON_STRING not set!");
    process.exit(1);
}

pg.defaults.ssl = true;
var dbClient = new pg.Client(CON_STRING);
dbClient.connect();

var urlencodedParser = bodyParser.urlencoded({
    extended: false
});

const PORT = 3000;

var app = express();

app.use(session({
    secret: "This is a secret!",
    resave:true,
    saveUninitialized: false
}));

app.set("views", "views");
app.set("view engine", "pug");

app.get("/", function (req, res) {
    res.render("index");
});

app.get("/register", function (req, res) {
    res.render("register");
});

app.get("/logout", function (req, res) {
    res.render("logout");
});

//Zum Testen:
app.post("/search", urlencodedParser, function(request, response) {
    response.render("search");
});

app.get("/search", function (req, res) {
    res.render("search");
});

app.listen(PORT, function () {
    console.log(`Bookstore App listening on Port ${PORT}`);
});
