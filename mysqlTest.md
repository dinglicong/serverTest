# mysqlTest.js 文档说明 #
#

## 数据库连接池##

	参考文章：http://blog.csdn.net/zxsrendong/article/details/17006185
<code>

	var options = {</br>
		'host': config.dbhost,//连接主机名</br>
	    'port': config.port,//连接数据库端口</br>
	    'user': config.user,//用户名</br>
	    'password': config.password,//密码</br>
	    'database': config.db,//数据库名</br>
	    'charset': config.charset,//连接的字符集. (默认: 'UTF8_GENERAL_CI'.设置该值要使用大写!)</br>
	    'connectionLimit': config.maxConnLimit,//最大连接数. (Default: 10)</br>
	    'supportBigNumbers': true,//数据库处理大数字(长整型和含小数),时应该启用 (默认: false).</br>
	    'bigNumberStrings': true//启用 supportBigNumbers和bigNumberStrings 并强制这些数字以字符串的方式返回(默认: false).   </br>
		'debug': true,//是否开启调试. (默认: false)  
		multipleStatements: true//是否允许在一个query中传递多个查询语句. (Default: false)  
		flags: 链接标志.
	};</br>
</code>

	创建数据库连接池
<code>var pool = mysql.createPool(options);</code>

<code>
	
	//mysql查询
	var query=function(sql,callback){  
		//获取数据库连接</br>
	    pool.getConnection(function(err,connection){  
	        if(err){  
	            callback(err,null,null);  
	        }else{  
	            connection.query(sql,function(qerr,vals,fields){  
	                //释放连接  
	                conn.release();  
	                //事件驱动回调  
	                callback(qerr,vals,fields);  
	            });  
	        }  
	    });  
	};
</code>


## promise机制 ##

	参考文档：http://www.ituring.com.cn/article/54547

nodejs中promise主要依赖于q插件，所以在使用promise之前安装q模块，并引入
<code>
	
	npm install q

	Q = require("q");
</code>
用<code>Q.defer</code>可以手动创建<code>promise</code>。比如将<code>fs.readFile</code>手工封装成<code>promise</code>的（基本上就是 <code>Q.denodify</code>做的事情 ）

<code>
	
	function fs_readFile (file, encoding) {
	  var deferred = Q.defer()
	  fs.readFile(file, encoding, function (err, data) {
	    if (err) deferred.reject(err) // rejects the promise with `er` as the reason
	    else deferred.resolve(data) // fulfills the promise with `data` as the value
	  })
	  return deferred.promise // the promise is returned
	}
	fs_readFile('myfile.txt').then(console.log, console.error)
</code>