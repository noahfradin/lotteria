var fbUtils = require('./fb_utils.js');
var dbUtils = require('./db_utils.js');

var express = require('express');
var engines = require('consolidate');

var app = express();
app.engine('html', engines.hogan);
app.set('views', __dirname + '/templates');

app.use('/include', express.static(__dirname + '/include'));
 
app.listen(8080, function() {
	console.log("- Server listening on port 8080");
});

app.get('*', function(request, response) {
  response.render('fb_testpage.html', {});
});