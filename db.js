var mysql =require('mysql');

/*var conn=mysql.createConnection({
	host:'172.16.100.161:3306',
	user:'spcadmin',
	password:'$pc@dm!n123',
	database:'spc',
});*/	

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
