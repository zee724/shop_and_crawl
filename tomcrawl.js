var express = require('express');
var myconfig = require('./config.js')
var bodyParser = require('body-parser');
var markdown = require("markdown").markdown;
var app = express();


// see https://github.com/expressjs/body-parser
// 添加 body-parser 中间件就可以了
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//set up mysql
var mysql = require('mysql');  
	      
var TEST_DATABASE = myconfig.myconfig.TEST_DATABASE; 
var TEST_TABLE = myconfig.myconfig.TEST_TABLE;

// set up handlebars view engine
var handlebars = require('express3-handlebars')
	.create({ defaultLayout:'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 80);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.status(404);
	res.render('404');
});
app.get('/about', function(req,res){

	//创建连接  
	var client = mysql.createConnection({  
	  user: myconfig.myconfig.db_user,  
	  password: myconfig.myconfig.db_passwd,  
	});

	client.connect();
	client.query("use " + TEST_DATABASE);
	
	client.query(  
	  'SELECT * FROM '+TEST_TABLE+' ORDER BY created desc',  
	  function selectCb(err, results, fields) {  
	    if (err) {  
	      throw err;  
	    }  
	      
	      if(results)
	      {
		  res.render('about',{results:results});
	      }    
	    client.end(); 
	});
	

});

app.get('/post/', function(req,res){

	//创建连接  
	var client = mysql.createConnection({  
	  user: myconfig.myconfig.db_user,  
	  password: myconfig.myconfig.db_passwd,  
	});

	client.connect();
	client.query("use " + TEST_DATABASE);
	
	client.query(  
	  'SELECT * FROM sm_post ORDER BY created desc',  
	  function selectCb(err, results, fields) {  
	    if (err) {  
	      throw err;  
	    }  
	      
	      if(results)
	      {
		  res.render('post',{results:results});
	      }    
	    client.end(); 
	});
	

});

app.get('/post/:postId', function(req,res){
	var postId = req.params.postId;
	
	//创建连接  
	var client = mysql.createConnection({  
	  user: myconfig.myconfig.db_user,  
	  password: myconfig.myconfig.db_passwd,  
	});

	client.connect();
	client.query("use " + TEST_DATABASE);
	
	client.query(  
	  'SELECT * FROM sm_post WHERE id = ' + postId ,  
	  function selectCb(err, results, fields) {  
	    if (err) {  
	      throw err;  
	    }  
	      
	      if(results)
	      {
		rs = results[0];
		title = rs.title;
		content = markdown.toHTML(rs.content);
		created = rs.created;
		res.render('postid',{title:title,content:content,created:created});
	      }    
	    client.end(); 
	});

});

app.get('/editpost', function(req,res){
	res.render('editpost');
});

app.post('/editpost', function(req,res){
    	res.render('editpost'); 


	//创建连接  
	var client = mysql.createConnection({  
	  user: myconfig.myconfig.db_user,  
	  password: myconfig.myconfig.db_passwd,  
	});

	client.connect();
	client.query("use " + TEST_DATABASE);
	
	var sql = 'INSERT INTO sm_post SET title=?,content=?',values = [req.body.title, req.body.content];
	client.query(  
	  sql,values,  
	  function selectCb(err, results, fields) {  
	    if (err) {  
	      throw err;  
	    }
	    client.end(); 
	});
});



// 404 catch-all handler (middleware)
app.use(function(req, res, next){
	res.status(404);
	res.render('404');
});

// 500 error handler (middleware)
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500);
	res.render('500');
});

app.listen(app.get('port'),'0.0.0.0', function(){
  console.log( 'Express started on http://localhost:' + 
    app.get('port') + '; press Ctrl-C to terminate.' );
});
