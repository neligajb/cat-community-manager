var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var geocoderPackage = require('./geocoder.js');
var db = require('mysql');

var pool = db.createPool({
	connectionLimit: 10,
	host: 'localhost',
	user: 'root',
	password: 'kittycats',
	multipleStatements: true
});

pool.on('connection', function(connection) {
	connection.query('CREATE DATABASE IF NOT EXISTS cats;', function(err){
		if(err) {
			console.log(this.sql);
			next(err);
		};
	});

	connection.query('USE cats', function (err) {
		if(err) {
			console.log(this.sql);
			next(err);
		}
	});
});

var createTables = function(){
	pool.query('CREATE TABLE IF NOT EXISTS reports(' +
						 'id INT NOT NULL AUTO_INCREMENT,' +
						 'latitude INT(100),' +
						 'longitude INT(100),' +
						 'country VARCHAR(255),' +
						 'countryCode VARCHAR(255),' +
						 'city VARCHAR(255),' +
						 'zipcode INT(100),' +
						 'streetName VARCHAR(255),' +
						 'streetNumber INT(100),' +
						 'photoName VARCHAR(255),' +
						 'description VARCHAR(2000),' +
						 'fixed VARCHAR(255),' +
						 'PRIMARY KEY(id)'+
						 ')ENGINE=INNODB;',
		function(err){
			if(err){console.log(this.sql); throw err;};
	});
};

createTables();

// the bodyParser package simplifies AJAX transactions
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
}));

// define static content directory
app.use(express.static('public'));

app.set('json spaces', 2);


// index route
app.get('/', function(req,res){
	res.sendFile('./public/index.html');
});


// posting cat object
app.post('/add-cat', function(req, res) {
	var cat_object = req.body.cat;

	// all code executed on the cat object must be run inside the Geocoding callback
	// to ensure that we have receieved the coordinates from the Google API
	geocodeAddress(cat_object.address, function(location) {
		console.log('lat: ' + location.latitude);
		console.log('long: ' + location.longitude);

		// response to the client
		res.send('successfully posted a cat');
	});
});


// getting cat object
app.get('/get-cat', function(req, res) {
	var id = req.body.id;
	// fetch the cat's full data using its ID
	console.log('cat id: ' + id);

	res.send({
		// dummy data
		id: 1234,
		location: '1600 Pennsylvania Avenue',
		fixed: false,
		description: 'light gray coat',
		image: 'path to image file'
	});
});


// get the lat and long by sending the address to Google API
function geocodeAddress(address, fn) {
	geocoderPackage.geocoder.geocode(address, function(err, res) {
		fn(res[0]);
	});
}


app.listen(3000, function(){
	console.log('App running on http://localhost:3000');
});
