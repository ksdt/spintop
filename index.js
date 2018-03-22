const express    = require('express');
const app 	     = express();
const path       = require('path');
const formidable = require('formidable');
const parser     = require('./csvparse.js');

//send the index page on a get request
app.get('*', (req, res) => res.sendFile(path.join(__dirname + "/index.html")))

app.listen(3000, () => console.log('Example app listening on port 3000!'))

app.post('/upload', function(req, res) {
  //upload the file from the html form
  var form = formidable.IncomingForm();
  form.parse(req,function(err, fields, files) {
  	if (err) throw err;
  	res.write('file uploaded');
  	//get the path to the uploaded file for the parser to use
  	var filePath = files.spinFile.path;

  	//TODO: fix this bug and then just output the data string
  	//Why does this callback not execute????
  	parser(filePath, function(err,data) {
  		console.log("data" + data);
  		//res.send(data);
  	});
  	res.end();
  });
});
