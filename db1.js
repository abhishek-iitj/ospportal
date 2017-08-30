var mysql =require('mysql');

var conn=mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'',
	database:'spc',
});	

conn.connect(function(error){
	if(!!error) console.log(error);
	else console.log("Connected to MYSQL");
});

module.exports=conn;
