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
    cookie: { maxAge: 3600000 },
    resave: false,
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

app.post("/register", urlencodedParser, function(req, res){
    dbClient.query("INSERT INTO users (benutzer, passwort) VALUES ($1, $2)", [req.body.benutzer, req.body.passwort], function (dbError, dbResponse) {
                res.render("registersuccess");
            });
});

app.get("/logout", function(req, res) {
    if(req.session.user!=null){
        req.session.destroy(function (error) {       
        res.render("logout", {Logout: "Sie wurden ausgeloggt."});
        });
    }
    else{
        res.render("logout", {Logout: "Sie waren gar nicht erst eingeloggt."});
    }
});

app.post("/", urlencodedParser, function(req, res) {
    dbClient.query("SELECT * FROM users WHERE benutzer=$1 AND passwort=$2", [req.body.benutzer, req.body.passwort], function(dbError, dbResponse){
        if(dbResponse.rows.length===0){
            var fehler= "Benutzername bzw. Passwort falsch";
            res.render("index", {Fehler: fehler});
        }
        else{
            req.session.user = req.body.benutzer;
            res.redirect("/search");
        }
    })
});

app.get("/search", function (req, res) {
    res.render("search");
});

app.listen(PORT, function () {
    console.log(`Bookstore App listening on Port ${PORT}`);
});
