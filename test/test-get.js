process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');

var should = require('chai').should();
chai.use(chaiHttp);

//Test the GET route
describe('GET cat', () => {
	it('should GET a cat object', (done) => {
		chai.request(server)
		.get('/get-cat')
		.end(function(err,res){
			res.should.have.status(200);
			done();
		});
	});
});