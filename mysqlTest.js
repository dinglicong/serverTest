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


var pool = mysql.createPool({
	host: "127.0.0.1",
	port: "3306",
	database: "orderdb",
	user: "root",
	password: "123456",
	connectionLimit: 20,
	charset: 'utf8_general_ci',
	debug: true
});


//client.connect();

function queryUser(req){
	var name = req.query["name"]?req.query["name"]:"";
	var departmentId = req.query["departmentId"]?req.query["departmentId"]:"";
	var sql = "select * from user where name like '%" + name + "%' and department_id like '%" + departmentId +"%'";
	console.log(sql);
	var deferred = Q.defer();

	//获取连接
	pool.getConnection(function(err,connection){
		if(err){
			util.log(err);
		}else{
			//启用查询
			connection.query(sql,function(qerr,resluts,fields){
				if(qerr){
					util.log(error.message);
					//释放数据库连接
					connection.release();
					//promise捕获异常
					deferred.reject(qerr);
				}else{
					console.log(resluts);
					for(var i = 0, rl = resluts.length; i < rl; i++){
						var item = resluts[i];
						console.log("id:" + item["Id"] + "	name:" + item["name"] + "	departmentId:" + item["department_id"]);
					}
					//释放数据库连接
					connection.release();
					
					console.log("关闭MYSQL连接.....");
					//promise  then
					deferred.resolve(resluts);
				}
			})
		}
	})
	//返回promise 
	return deferred.promise;
};

app.listen(3000);