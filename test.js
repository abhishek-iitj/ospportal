var http = require('http');
var fs = require('fs');
var formidable = require("formidable");
var util = require('util');

function send404Response(response){
	response.writeHead(404, {"Content-Type":"text/plain"});
	response.write("Error 404 : Requested file not found");
	response.end();
}

function onRequest(request, response){
	if(request.method=='GET' && request.url=='/'){
		response.writeHead(200, {"Content-Type":"text/html"});
		fs.createReadStream("./index.html").pipe(response);
	}
	else if(request.method=='GET' && request.url=='/admin'){
		response.writeHead(200, {"Content-Type":"text/html"});
		fs.createReadStream("./admin.html").pipe(response);
	}
	else if(request.method=='POST'){
		processAllFieldsOfTheForm(request, response)
	}
	else{
		send404Response(response);
	}
}

function processAllFieldsOfTheForm(req, res) {
    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
        //Store the data from the fields in your data store.
        //The data store could be a file or database or any other store based
        //on your application.
        res.writeHead(200, {
            'content-type': 'text/plain'
        });
        res.write('received the data:\n\n');
        res.end(util.inspect({
            fields: fields,
            files: files
        }));
    });
}

http.createServer(onRequest).listen(8000);
console.log ("server is running....");