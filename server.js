var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var sessions = require('express-session');
var studentSession, companySession, adminSession;
var flash = require('express-flash-messages')
var app = express();
var mongoose = require('mongoose');
var conn = require('./db.js');
//if (!mongoose.connect('mongodb://localhost/my_database')) console.log("Erot");

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

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

var home = require('./routes/home');
var student = require('./routes/student');
var company = require('./routes/company');
var admin = require('./routes/admin');

app.use('/', home);
app.use('/student', student);
app.use('/company', company);
app.use('/admin', admin);





/* CFD18 Code Starts */


app.get('/cfd2018', function (req, res) {
    res.sendFile(__dirname + "/cfd2018.html");
});
app.post('/cfd2018/adduser/', function (req, res) {
    console.log("Post to add user called");
    console.log(req.body, 'Body');
    //console.log(req.files, 'files');
    var post = req.body;
    console.log(post);
    var insertqry = "INSERT INTO cfd18_users VALUES('" + req.body.unqid + "','" + req.body.name + "','" + req.body.phone + "','" + req.body.address + "')";
    console.log(insertqry);

    conn.query(insertqry, function (error, rows, fields) {
        if (!!error)
            console.log("Error in query");
        else {
            console.log("User added in DB");
            //console.log(company_email + " has added an offer with id " + unq_id);
            res.send("You have successfully added a user.");

        }
    });
});
app.post('/cfd2018/addrqst/', function (req, res) {
    console.log("Post to add rqst called");
    console.log(req.body, 'Body');
    //console.log(req.files, 'files');
    var post = req.body;
    console.log(post);
    var insertqry = "INSERT INTO cfd18_requests VALUES('" + req.body.rqstid + "','" + req.body.borrowerid + "','" + req.body.description + "','" + req.body.time + "')";
    console.log(insertqry);

    conn.query(insertqry, function (error, rows, fields) {
        if (!!error)
            console.log("Error in query");
        else {
            console.log("Request added in DB");
            //console.log(company_email + " has added an offer with id " + unq_id);
            res.send("You have successfully added a request.");

        }
    });
});
app.post('/cfd2018/addrsp/', function (req, res) {
    console.log("Post to add response called");
    console.log(req.body, 'Body');
    //console.log(req.files, 'files');
    var post = req.body;
    console.log(post);
    var insertqry = "INSERT INTO cfd18_responses VALUES('" + req.body.rqstid + "','" + req.body.lenderid + "','" + req.body.price + "')";
    console.log(insertqry);

    conn.query(insertqry, function (error, rows, fields) {
        if (!!error)
            console.log("Error in query");
        else {
            console.log("User added in DB");
            //console.log(company_email + " has added an offer with id " + unq_id);
            res.send("You have successfully added a Response.");

        }
    });
});
/* CFD18 Code Finsish Point*/



app.get('*', function(req, res){
  res.status(404).send('404 Page not found');
});
app.listen(80, function() {
    console.log("Server is running on port 80.");
});
