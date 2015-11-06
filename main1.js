var redis = require('redis')
var multer  = require('multer')
var express = require('express')
var fs      = require('fs')
var app = express()
var http = require('http')
var httpProxy = require('http-proxy')

// REDIS
var client = redis.createClient(6379, '127.0.0.1', {})

///////////// WEB ROUTES

// Add hook to make it easier to get all visited URLS.
app.use(function(req, res, next) 
{
	console.log(req.method, req.url);
  var url=req.url;
  client.lpush('urllist', url, function(err, data){
  client.ltrim('urllist',0,3);
  });
  next(); // Passing the request to the next handler in the stack.
});

app.post('/upload',[ multer({ dest: './uploads/'}), function(req, res){
    console.log(req.body) // form fields
    console.log(req.files) // form files

    if( req.files.image )
    {
 	   fs.readFile( req.files.image.path, function (err, data) {
	  		if (err) throw err;
 	  		var img = new Buffer(data).toString('base64');
        
         client.lpush('items', img, function(err, data){
    
    });
	  	
        console.log("Image uploaded successfully");
 		});
 	  }

   res.status(204).end();
 }]);

 app.get('/meow', function(req, res) {
 	
 
    client.lrange('items', 0, -1, function(err, items) {

 		if (err) throw err
 		res.writeHead(200, {'content-type':'text/html'});
		  		items.forEach(function (img) 
 		{
    		  res.write("<h1>This image has been downloaded using the server instance running on port 3001</h1><br>"+"<h1>\n<img src='data:my_pic.jpg;base64,"+img+"'/>");
 		});
    	res.end();
 	});
 
});

// HTTP SERVER
var server = app.listen(3001, function () {

  var host = server.address().address
  var port = server.address().port

   console.log('Example app listening at http://%s:%s', host, port)
 })
  
 app.get('/set', function(req, res) {
  res.write("<h1>The key has been set now using the server instance running on port 3001</h1>");
  client.set("key", "this message will self-destruct in 10 seconds");
  client.expire("key",10)
  res.end();
  
})

app.get('/get', function(req, res){ 
  client.get("key", function(err,value){ 
	  
	  res.send("<h1>The key has been fetched now using the server instance running on port 3001</h1><br>"+value);
	  });
   
})

app.get('/recent', function(req, res) {
 client.lrange('urllist', 0, -1, function(err, data) {    
       
 res.send(data);

  });
})


 
