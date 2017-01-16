var express = require('express');
var myconfig = require('./config.js')

var app = express();


//set up mysql
var mysql = require('mysql');  
	      
var TEST_DATABASE = myconfig.myconfig.TEST_DATABASE; 
var TEST_TABLE = myconfig.myconfig.TEST_TABLE;

// set up handlebars view engine
var handlebars = require('express3-handlebars')
	.create({ defaultLayout:'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

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
	  'SELECT * FROM '+TEST_TABLE,  
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

app.listen(app.get('port'), function(){
  console.log( 'Express started on http://localhost:' + 
    app.get('port') + '; press Ctrl-C to terminate.' );
});
