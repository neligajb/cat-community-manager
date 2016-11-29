process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var geocoderPackage = require('../geocoder.js');

var expect = require('chai').expect;
chai.use(chaiHttp);

//Test geocode function
describe('geocode address to longitude and latitude', () => {
	it('should transform address (string) to longitude and latitude (number)', (done) => {
		
		//call geocode function with test address of "Atlanta, Georgia".
		geocoderPackage.geocoder.geocode("Atlanta, GA", function (err, data){
			expect(data[0].longitude).to.be.a('number');
			expect(data[0].latitude).to.be.a('number');
			done();
		});
	});
});