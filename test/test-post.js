process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');

var should = require('chai').should();
chai.use(chaiHttp);

//Test the POST route
describe('/POST cat', () => {
	it('should POST a cat object', (done) => {
		var test_cat = {
			address: '16 Midland Rd, Springfield, PA 19064',
			fixed: 0,
			image: 'image.png',
			description: 'test description'
		}
	chai.request(server)
		.post('/add-cat')
		.send(test_cat)
		.end((err, res) =>{
			res.should.have.status(200);
		done();
		});
	});
});