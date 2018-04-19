const express    = require('express');
const app 	     = express();
const path       = require('path');
const port       = process.env.PORT || 3000;
const formidable = require('formidable');
const parser     = require('./csvparse.js');

//send the index page on a get request
app.get('*', (req, res) => res.sendFile(path.join(__dirname + "/index.html")));
app.listen(port, () => console.log('Example app listening on port: !' + port));



app.post('/upload', function(req, res) {
  //upload the file from the html form
  var form = new formidable.IncomingForm();
  form.parse(req,function(err, fields, files) {
  	if (err) throw err;
  	//get the path to the uploaded file for the parser to use
  	var filePath = files.spinFile.path;
  	parser(filePath, function(data) {
      if (data == null) {
        res.end();
      }
  		res.send("<code>" + data + "</code>");
      res.end();
  	});
  });
});

