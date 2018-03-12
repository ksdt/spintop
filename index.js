const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(3000, () => console.log('Example app listening on port 3000!'))

app.post('/upload', function(req, res) {
  console.log(req.files.foo); // the uploaded file object
});
