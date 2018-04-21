const express     = require('express');
const app 	      = express();
const path        = require('path');
const port        = process.env.PORT || 3000;
const formidable  = require('formidable');
const importFresh = require('import-fresh');
const fs 		  = require('fs');

//send the index page on a get request
app.listen(port, () => console.log('Example app listening on port: ' + port));
app.get('*', (req, res) => res.sendFile(path.join(__dirname + "/index.html")));

app.post('/upload', function(req, res) {
  //load the parser from scratch each time so that the state is reset
  var parser = importFresh('./csvparse.js');
  //upload the file from the html form
  var form = new formidable.IncomingForm();
  form.parse(req,function(err, fields, files) {
  	if (err) throw err;
  	//get the path to the uploaded file for the parser to use
  	var filePath = files.spinFile.path;
  	//send the filePath to the parser and do the parsing
  	parser(filePath, function(data) {
  		//if there is some sort of err, just send the default page again
      	if (data == null) {
        	res.sendFile(path.join(__dirname + "/index.html"));
      	}	
      		//output the code
  			res.send("<code>" + data + "</code>");
  	});
  });
});