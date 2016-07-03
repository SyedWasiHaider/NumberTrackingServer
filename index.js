var express = require('express');
var app = express();
var multer  =   require('multer');

app.set('port', (process.env.PORT || 5000));

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now());
  }
});

var upload = multer({ storage : storage}).single('userPhoto');


app.get('/', function(request, response) {
  response.send("hellooooo");
});

app.post('/api/photo',function(req,res){
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

