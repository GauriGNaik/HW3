var redis = require('redis')
var multer  = require('multer')
var express = require('express')
var fs      = require('fs')
var app = express()
var http = require('http')
var httpProxy = require('http-proxy')
var flag=0;
// REDIS
var client = redis.createClient(6379, '127.0.0.1', {})

var proxy = httpProxy.createProxyServer({});

//PROXY SERVER
var server = http.createServer(function(req, res) {

    if(flag==0)  {

    client.ltrim('queue',1,0);

    var url='http://localhost:3000'

    client.lpush('queue',url,function(err, data){

   //console.log(url);
   var url1='http://localhost:3001'

    client.lpush('queue',url1,function(err, data){
  
    //console.log(url1);
           client.rpoplpush('queue','inprocess', function(err, data){
           if (err) return console.log(err);
           if (!data)
               return;
           else  {
               console.log("Pushed out of the queue and executed on the server instance: "+data);
               proxy.web(req, res, {target: data}); 
               }

           client.rpoplpush('inprocess','queue', function(err, data){
           if (err) return console.log(err);
           if (!data)
               return;
           else
              console.log("Pushed back in to the queue: "+data);
           });
           });
         });
     });
      flag=1;
     }
     else {
         
           client.rpoplpush('queue','inprocess', function(err, data){
           if (err) return console.log(err);
           if (!data)
               return;
           else  {
               console.log("Pushed out of the queue and executed on the server instance: "+data);
               proxy.web(req, res, {target: data}); 
               }

           client.rpoplpush('inprocess','queue', function(err, data){
           if (err) return console.log(err);
           if (!data)
               return;
           else
              console.log("Pushed back in to the queue: "+data);
           });
           });


     }
    
    });

server.listen(80);
