var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var sessions = require('express-session');
var studentSession, companySession, adminSession;
var flash = require('express-flash-messages')
var app = express();

var conn = require('./db.js');

app.set('view-engine', 'ejs');
app.use('/public', express.static(__dirname + '/public')); //to use css files
//app.use('/resume/:userName', express.static(__dirname + '/resume/:userName'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(sessions({
    secret: '*7(7987*@#&$%(*&#)(*$',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());

var arrayr = [];
var arrayname = [];
var len;
app.get('/', function(req, res){
	res.status(404).send('404 Page not found');	
});
app.get('/data', function(req, res){
	var qry="SELECT * FROM applications where 1";
	console.log(qry);
	conn.query(qry, function(error, rows, fields){
		if(error)
			console.log("Error in query 1");
		else if(rows.length==0)
			console.log("No Applications");
		else{
			len=rows.length;
			for(var i=0;i<rows.length;i++){
				var qry2 = "SELECT * FROM students where ldap_id='" + rows[i].student_id + "'";
				    console.log(qry2);
				    arrayr.push(rows[i].student_id);
				    //var oname = rows[i].student_id;
				    //console.log(oname);
				    conn.query(qry2, function(error2, rows2, fields) {
				        //console.log("Length " + rows.length);
				        if (rows2.length == 1) {
				        	console.log(i);
				        	arrayname.push(rows2[0].name);
						            
				        } else {
				        	res.sendFile(__dirname + "/index.html");
				            //var str = encodeURIComponent('false');
				            //res.redirect('/student/login/?valid=' + str);
				        }
				    });
			}
		}
	});	
	res.sendFile(__dirname + "/index.html");			
});
app.get('/watch', function(req, res){
	console.log(arrayr);
	console.log(arrayname);
	
	//res.sendFile(__dirname + "/index.html");			
});

app.get('/do', function(req, res){
	console.log(arrayr);
	console.log(arrayname);
	for(var i=0;i<len;i++){
		var uqry = "UPDATE applications SET name='" + arrayname[i] + "' WHERE student_id='" +arrayr[i]+ "' ";
		console.log(uqry);
		conn.query(uqry, function(error0, rows0, fields) {
		    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		    if (!error0) {
		        //var str = encodeURIComponent('true');
		        console.log("hurrah")
		        //res.redirect('/student/register/?valid=' + str);
		    } 
		    else {
		        console.log("Error in uquery");
		        //res.sendFile(__dirname + "/index.html");
		        //var str = encodeURIComponent('error');
		        //res.redirect('/student/register/?valid=' + str);  
		    }
		});
	}
	//res.sendFile(__dirname + "/index.html");			
});
	

app.get('*', function(req, res){
  res.status(404).send('404 Page not found');
});
app.listen(80, function() {
    console.log("Server is running on port 80.");
});