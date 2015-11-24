var fs = require("fs"),
	express = require("express"),
	Q = require("q"),
	http = require('http'),
	url = require("url"),
	util = require("util"),
	http = require("http"),
	request = require("request"),
	app = express(),
	router = express.Router(),
	mkdirp = require("mkdirp"),
	imgCount = 0,
	index = 0;
	
	
	
	function readImageUrl(url){
		var deferred = Q.defer();
		fs.readFile(url,function(error,text){
			if(error){
				util.log(error);
				deferred.reject(error);
			}else{
				var str = text.toString(),
					_arr = str.split(/\r\n/);
				console.log(str);
				//var _arr = text.split("\n");
				console.log(_arr);
				imgCount = _arr.length;
				console.log(_arr.length);
				deferred.resolve(_arr);
			}
			
		})
		
		return deferred.promise;
	}
	
	var dir = "./images";
	
	mkdirp(dir,function(err){
		if(err){
			util.log(err);
		}
	});
	
	function writeImage(data){
		if(index<imgCount){
			console.log(index);
			request.head(data[index],function(err,res,body){
				
				request(data[index]).pipe(fs.createWriteStream(dir + "/" + index + ".jpg"))
				index++;
				writeImage(data);
			});
			
		} 
	}
	
	readImageUrl("imgList.txt").then(writeImage);
	
	
	
	