var util = require("util"); 
var fs = require("fs"); 
var path = require('path');
module.exports.controller = function(app, passport){
	
	app.get('/uploadPage', function(req, res) { 
	  res.render("dashboard/uploadFile.ejs", {title: "I love files!"}); 
	}); 
	 
	app.post("/upload", function(req, res, next){ 
		if (req.files) { 
			console.log(util.inspect(req.files));
			if (req.files.myFile.size === 0) {
			            return next(new Error("Hey, first would you select a file?"));
			}
			
			console.log("previous PATH");
			console.log(req.files.myFile.path);
			console.log(path.join(__dirname, 'public'));
			fs.exists(req.files.myFile.path, function(exists) { 
				console.log("Exisits info;")
				console.log(exists);
				if(exists) { 
					res.end("Got your file!"); 
				} else { 
					res.end("Well, there is no magic for those who don’t believe in it!"); 
				} 
			}); 
		} 
	});

	app.post('/file-upload', function(req, res) {

	    // get the temporary location of the file
	    var tmp_path = req.files.myFile.path;
	    // set where the file should actually exists - in this case it is in the "images" directory
	    var target_path = './public/uploads/images/' + req.files.myFile.name;
	    // move the file from the temporary location to the intended location
	    fs.rename(tmp_path, target_path, function(err) {
	        if (err) throw err;
	        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
	        fs.unlink(tmp_path, function() {
	            if (err) throw err;
	            res.send('File uploaded to: ' + target_path + ' - ' + req.files.myFile.size + ' bytes');
	        });
	    });

	});
	
	//http://stackoverflow.com/questions/13124711/storing-a-file-in-postgres-using-node-postgres

	app.get("/getFile", function(req, res){
		var img = fs.readFileSync("./public/images/b86646cbf7c8d2b95b8195d78d4adf0b.png");
		res.writeHead(200,{'Content-Type' : 'image/png'});
		// res.send({"img" : img, "type" : "binary"});
		res.end(img, 'binary');
	});

	// /public/images/b86646cbf7c8d2b95b8195d78d4adf0b.png

};
