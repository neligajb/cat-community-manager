var express = require('express'),
		logger = require('morgan'),
		app = express(),
		bodyParser = require('body-parser'),
		geocoderPackage = require('./geocoder.js'),
		db = require('mysql');
    dbCreds = require('./db-creds.js');


var pool = db.createPool({
	connectionLimit: 10,
	host: dbCreds.getHost(),
	user: dbCreds.getUser(),
	password: dbCreds.getPassword(),
	multipleStatements: true
});

pool.on('connection', function(connection) {
	connection.query('CREATE DATABASE IF NOT EXISTS cats;', function(err){
		if(err) {
			console.log(this.sql);
			next(err);
		}
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
						 'latitude DOUBLE,' +
						 'longitude DOUBLE,' +
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
app.use(logger('combined'));
app.use(express.static('public'));
app.set('json spaces', 2);


// index route
app.get('/', function(req,res){
	res.status(200).sendFile('./public/index.html');
});


// posting cat object
app.post('/add-cat', function(req, res, next) {
	var cat_object = req.body.cat;

	// all code executed on the cat object must be run inside the Geocoding callback
	// to ensure that we have receieved the coordinates from the Google API
	geocodeAddress(cat_object.address, function(location) {
		console.log('lat: ' + location.latitude);
		console.log('long: ' + location.longitude);

		pool.query('INSERT INTO reports '
							 + '(latitude, longitude, description, fixed, photoName)'
							 + ' VALUES ('
							 + location.latitude + ','
							 + location.longitude + ','
							 + "'" + cat_object.description + "'"  +','
							 + "'" + cat_object.fixed + "'" + ','
							 + "'" + cat_object.image + "'" +');'
		, function(err, rows){
			if(err) {
				// Logging Error to console for failed insert query
				console.log(this.sql);
				res.send(err);
				next(err);
			} else {
				// Success
				res.send('successfully posted a cat');
			}
		});
	});
});


// getting cat object
app.get('/get-cat', function(req, res, next) {
	var id = req.body.id;
	// fetch the cat's full data using its ID
	console.log('cat id: ' + id);

	pool.query('SELECT * FROM reports;', function(err, rows){
		if(err){
			next(err);
		} else {
			if(rows[0] !== undefined){
				res.json(rows);
			}
		}
	})
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
