'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);
mongoose.connect(process.env.MONGOLAB_URI);
app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
var bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

var dns=require('dns');
var count;
var schema=new mongoose.Schema({
original_url:String,
short_url:String
});
var url_model=mongoose.model('url_model',schema);
// var doc=new url_model({"original_url":"","short_url":""});
// doc.save(function(err,data){console.log(data);});
 //var doc=new url_model({"original_url":"https://www.freecodecamp.com","short_url":"1"});
           // doc.original_url=url;
           // doc.short_url=(count).toString();
         //  doc.save(function(err,data){
             //if(err) console.log(err);
         //  console.log("hi");
           //res.json({"original_url":url,"short_url":count});
      //     });
url_model.findOne().sort({short_url:-1}).limit(1).select("short_url").exec(function(err,data){
//console.log("hii");
//console.log(count);

  if(data==null)count=0;
  else count=data.short_url;
});        
app.post('/api/shorturl/new',function(req,res){
  //console.log(req.body);
  var url=req.body.url;
  dns.lookup(url,function(err,data){
    //console.log(err);
  if(err)res.json({"error":"invalid URL"});
 // console.log(err); 
   else {
       url_model.findOne({original_url:url},function(err,data){
         if(!data){
           count++;
           var doc=new url_model({"original_url":url,"short_url":(count).toString()});
           doc.save(function(err,data){});
           console.log(data);
           res.json({"original_url":url,"short_url":(count).toString()});
         }
        else {//console.log(data);
           res.json({"original_url":data.original_url,"short_url":data.short_url});}
      });
   }
   });
});


app.get('/api/shorturl/:url',function(req,res){
  var new_url=req.params.url;
  console.log(new_url);
   url_model.findOne({short_url:req.params.url},function(err,data){
  if(data==null)res.write("Invalid URL");
     else res.redirect("https://"+data.original_url);
   });
});
app.listen(port, function () {
  console.log('Node.js listening ...');
});