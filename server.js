var express=require ('express');
var app = express();
var bodyParser = require('body-parser');
var sessions = require ('express-session');
var session;
// app.use('/public', express.static(__dirname+'/public'))
// app.use(bodyParser().json());
// app.use(bodyParser().urlencpded({extended:true}));

app.use(sessions({
	secret:'*7(7987*@#&$%(*&#)(*$'
}));
app.get("/login", function(req, res){
	res.sendFile(__dirname+"/index.html");
});

app.post('/login', function(req, res){
	res.end(JSON.stringify(req.body));
	if(req.body.username == 'admin' && req.body.password=='admin'){
		session.id=req.body.username;
	}
	resp.redirect('/redirects');
});

app.get('/redirects', function(req, res){
	if (session.id) resp.redirect('/admin');
	else resp.end('Who are you');
});
app.listen(3000, function(){
	console.log("Server is running on port 3000...");
});