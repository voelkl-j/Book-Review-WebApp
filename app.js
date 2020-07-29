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
app.use(express.static("public"));
app.use(session({
    secret: "This is a secret!"
    , cookie: {
        maxAge: 3600000
    }
    , resave: false
    , saveUninitialized: false
}));
app.set("views", "views");
app.set("view engine", "pug");

app.get("/", function (req, res) {
    res.render("index");
});
app.get("/register", function (req, res) {
    res.render("register");
});
app.post("/register", urlencodedParser, function (req, res) {
    dbClient.query("INSERT INTO users (username, password) VALUES ($1, $2)", [req.body.username, req.body.password], function (dbError, dbResponse) {
        res.render("registersuccess");
    });
});
app.get("/logout", function (req, res) {
    if (req.session.user != null) {
        req.session.destroy(function (error) {
            res.render("logout", {
                Logout: "You've been logged out!"
            });
        });
    }
    else {
        res.render("logout", {
            Logout: "You have never been logged in."
        });
    }
});
app.post("/", urlencodedParser, function (req, res) {
    dbClient.query("SELECT * FROM users WHERE username=$1 AND password=$2", [req.body.username, req.body.password], function (dbError, dbResponse) {
        if (dbResponse.rows.length === 0) {
            var fehler = "Username or Password incorrect";
            res.render("index", {
                ErrorMessage: fehler
            });
        }
        else {
            req.session.user = req.body.benutzer;
            res.redirect("/search");
        }
    })
});
app.get("/search", function (req, res) {
    res.render("search");
});
app.post("/searchdata", urlencodedParser, function (req, res) {
    res.setHeader("Content-Type", "application/json");
    dbClient.query("SELECT * FROM books WHERE isbn LIKE ($2) OR title ~*($1) OR author ~*($1) LIMIT 10", [req.body.text, req.body.text + "%"], function (dbError, dbResponse) {
        console.log(dbError);
        res.end(JSON.stringify({
            books: dbResponse.rows
        }));
    });
});
app.get("/detail/:id", function (req, res) {
    var title;
    var author;
    var year;
    var isbn;
    dbClient.query("SELECT * FROM books WHERE id=($1)", [req.params.id], function (dbError, dbResponse) {
        title = dbResponse.rows[0].title;
        author = dbResponse.rows[0].author;
        year = dbResponse.rows[0].year;
        isbn = dbResponse.rows[0].isbn
    });
    dbClient.query("SELECT * FROM reviews WHERE bookid=($1)", [req.params.id], function (dbError, dbResponse) {
        var average = 0;
        for (var i = 0; i < dbResponse.rows.length; i++) {
            average += dbResponse.rows[i].rating;
        }
        average = average / i;
        average = average.toFixed(2);
        if (average == "NaN") {
            average = "No ratings yet!";
        }
        res.render("detail", {
            Title: title
            , Author: author
            , Year: year
            , Isbn: isbn
            , RatingAvg: average
            , reviews: dbResponse.rows
        });
    });
});
app.post("/detail/:id", urlencodedParser, function (req, res) {
    var username = req.session.user;
    var id = req.params.id;
    if (username != null) {
        dbClient.query("INSERT INTO reviews (reviewauthor, bookid, rating, text) VALUES ($1, $2, $3, $4)", [username, id, req.body.rating, req.body.comment], function (dbError, dbResponse) {
            if (dbError != null) {
                console.log("Review already submitted before.")
            }
        });
    }
    else {
        console.log("User not logged in.");
    }
    res.redirect("/detail/" + req.params.id);
});
app.listen(PORT, function () {
    console.log(`Bookstore App listening on Port ${PORT}`);
});