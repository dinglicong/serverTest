var express = require("express"),
	mysql = require("mysql"),
	http = require("http"),
	util = require("util"),
	Q = require("q"),
	app = express(),
	router = express.Router();

//路由过滤器
router.all("*",function(req,res,next){
	util.log(JSON.stringify(req.query));
	next();
});

app.get("/userList", router);
app.get("/userList", function(req, res){
	//var results = Q.denodeify();
	queryUser(req).then(function(data){
		console.log(data);
		res.send(data);
	},util.log);
	
});


var client = mysql.createConnection({
	host: "127.0.0.1",
	port: "3306",
	database: "orderdb",
	user: "root",
	password: "123456"
});


client.connect();

function queryUser(req){
	var name = req.query["name"]?req.query["name"]:"";
	var departmentId = req.query["departmentId"]?req.query["departmentId"]:"";
	var sql = "select * from user where name like '%" + name + "%' and department_id like '%" + departmentId +"%'";
	console.log(sql);
	var deferred = Q.defer();
	client.query(
		sql,
		function(error, resluts, fields){
			if(error){
				util.log(error.message);
				client.end();
				deferred.reject(error);
			}else{
				console.log(resluts);
				for(var i = 0, rl = resluts.length; i < rl; i++){
					var item = resluts[i];
					console.log("id:" + item["Id"] + "	name:" + item["name"] + "	departmentId:" + item["department_id"]);
				}
				
				client.end();
				
				console.log("关闭MYSQL连接.....");
				
				deferred.resolve(resluts);
			}
			
		}
	)
	return deferred.promise;
};

app.listen(3000);