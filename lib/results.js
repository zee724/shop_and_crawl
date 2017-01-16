exports.getResults = function() {	
	var mysql = require('mysql');  
	      
	var TEST_DATABASE = 'smzdm';  
	var TEST_TABLE = 'smzdm_record';  
	  
	//创建连接  
	var client = mysql.createConnection({  
	  user: 'root',  
	  password: '123456',  
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
		  for(var i = 0; i < results.length; i++)
		  {
		     console.log("%s\t%s", results[i].title, results[i].price);
		  }
	      }    
	    client.end(); 
	});
}

