var fs= require('fs');
var csvStream= require('csv-reader');


//Für datenbank kommunikation:
var pg = require("pg");
var CON_STRING = process.env.DB_CON_STRING;
if (CON_STRING == undefined) {
    console.log("Error: Environment variable DB_CON_STRING not set!");
    process.exit(1);
}
pg.defaults.ssl = true;
var dbClient = new pg.Client(CON_STRING);
dbClient.connect();
//DB setup ende

var inputStream = fs.createReadStream('books.csv', 'utf8');

inputStream
    .pipe(new csvStream({ skipHeader: true, parseNumbers: true, parseBooleans: true, trim: true }))
    .on('data', function (row) {
        console.log('A row arrived: ', row); 
         dbClient.query("INSERT INTO books (isbn, title, author, year) VALUES ($1, $2, $3, $4)", row, function(dbError, dbResponse){
            console.log("success");
    });
    })
    .on('end', function (data) {
        console.log('No more rows!');
    });
