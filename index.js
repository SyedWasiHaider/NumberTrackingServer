var express = require('express');
var app = express();
var multer  =   require('multer');
var fs  = require('fs');
var okrabyte = require('okrabyte');
var gm = require('gm').subClass({ imageMagick: true });;
var dir = './uploads';



if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

app.set('port', (process.env.PORT || 5000));

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname);
  }
});

var upload = multer({ storage : storage}).single('image');


app.get('/', function(request, response) {
  response.send("hellooooo");
});

app.post('/api/photo',function(req,res){
    upload(req,res,function(err) {
    	console.log(req.file)
        if(err) {
        	console.log(err);
            return res.end("Error uploading file.");
        }

        var pngPath = req.file.path + ".png";
        gm(req.file.path)
		.noProfile()
		.resize(1000)
		.write(pngPath, function (err) {
		  if (err){
		  	console.log(err);
		  	res.send(err);
		  	fs.unlink(pngPath);
		  } else{
		  	console.log('done');
		  	okrabyte.decodeFile(pngPath, function(error, data){
        		console.log(error);
        		console.log(data);
        		res.end(data);
        		fs.unlink(pngPath);
			});
		  }
		  fs.unlink(req.file.path);
		});

    });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

