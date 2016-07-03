var express = require('express');
var app = express();
var multer  =   require('multer');
var fs  = require('fs');
var gm = require('gm').subClass({ imageMagick: true });;
var dir = './uploads';

var tesseract = require('node-tesseract');
 



if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

app.use(express.static(__dirname + '/uploads'));
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

        var imagePath = req.file.path;
        gm(imagePath)
        .type("grayscale")
        .threshold(50,100)
        .out("-define")
    	.out("png:color-type=2")
        .noProfile()
		.write(imagePath, function (err) {
		  if (err){
		  	console.log(err);
        res.status(400).err("Please provide a valid image");
		  	fs.unlink(imagePath);
		  } else{
		  	console.log('done');
		  	// Recognize text of any language in any format
        tesseract.process(imagePath,function(err, text) {
              if(err) {
                  console.log(err);
                  res.status(500).err("Could not process this image.");
                } else {
                  console.log(text);
                  res.send(text);
              }
        		fs.unlink(imagePath);
			   });
		  }
		});

    });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

