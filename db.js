var mysql =require('mysql');

var conn=mysql.createConnection({
	host:'localhost',
//	port:'3306',
	user:'root',
	password:'db@1234',
	database:'spc',
});	
/*var conn=mysql.createConnection({
	host:'sql12.freemysqlhosting.net',
//	port:'3306',
	user:'sql12192631',
	password:'K43IyTpv6G',
	database:'sql12192631',
});*/

conn.connect(function(error){
	if(!!error) console.log(error);
	else console.log("Connected to MYSQL");
});

module.exports=conn;
