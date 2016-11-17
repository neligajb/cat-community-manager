var express = require('express');
var app = express();

app.use(express.static('public'));
app.use('json spaces', 2);

app.get('/', function(req,res){
	res.sendFile('./public/index.html');
});

app.listen(3000, function(){
	console.log('App running on http://localhost:3000');
});
