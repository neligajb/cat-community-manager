var express = require('express'),
		logger = require('morgan'),
		app = express(),
		geocoderPackage = require('./geocoder.js'),
		formidable = require('express-formidable'),
		fs = require('fs-extra'),
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

// the express-formidable handles multi-type AJAX transactions
app.use(formidable());

// define static content directory
app.use(logger('combined'));
app.use(express.static(__dirname + '/public'));
app.set('json spaces', 2);

// GET /style.css, general.js, etc
app.use('/css', express.static(__dirname + '/public'));
app.use('/js', express.static(__dirname + '/public'));

// index route
app.get('/', function(req,res){
	res.status(200).sendFile(__dirname + '/public/index.html');
});


// posting cat object
app.post('/add-cat', function(req, res, next) {
	var cat_object = req.fields;
	var image_path = req.files.image.path;
	var image_name = req.files.image.name;

	processImage(image_path, image_name);

	// all code executed on the cat object must be run inside the Geocoding callback
	// to ensure that we have receieved the coordinates from the Google API
	geocodeAddress(cat_object.address, function(location) {
    console.log(location);
    if (location === undefined) {
      res.send({message: 'could not find address'});
      return;
    }

		pool.query('INSERT INTO reports '
							 + '(latitude, longitude, country, countryCode, city, zipcode, streetName, streetNumber, description, fixed, photoName)'
							 + ' VALUES ('
							 + location.latitude + ','
							 + location.longitude + ','
				       + "'" + location.country + "'" + ','
				       + "'" + location.countryCode + "'" + ','
				       + "'" + location.city + "'" + ','
				       + location.zipcode + ','
				       + "'" + location.streetName + "'" + ','
				       + location.streetNumber + ','
							 + "'" + cat_object.description + "'"  +','
							 + "'" + cat_object.fixed + "'" + ','
							 + "'/uploads/" + image_name + "'" +');'
		, function(err, rows){
			if(err) {
				// Logging Error to console for failed insert query
				console.log(this.sql);
				res.send(err);
				next(err);
			} else {
				// Success
				console.log('meaaaa');
				res.send({message: 'cat added'});
			}
		});
	});
});


// getting cat object
app.get('/get-cat', function(req, res, next) {
	var id = req.query.id;

	if (id !== undefined) {
		pool.query('SELECT * FROM reports WHERE id = ' + id + ';', function(err, rows){
			if(err){
				next(err);
			} else {
				if(rows[0] !== undefined){
					res.json(rows);
				}
			}
		});
	}
	else {
		pool.query('SELECT * FROM reports;', function(err, rows){
			if(err){
				next(err);
			} else {
				if(rows[0] !== undefined){
					res.json(rows);
				}
			}
		});
	}

});


// process the image file
function processImage(path, name) {
	var new_location = 'public/uploads/';

	fs.copy(path, new_location + name, function(err) {
		if (err) {
			console.error(err);
		} else {
			console.log("success!")
		}
	});
}


// get the lat and long by sending the address to Google API
function geocodeAddress(address, fn) {
	geocoderPackage.geocoder.geocode(address, function(err, res) {
		fn(res[0]);
	});
}


app.listen(8080, function(){
	console.log('App running on port 8080');
});
