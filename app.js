var htp = require("http");
var qs = require('querystring');
var urll = require('url');
var fs = require('fs');
var pat = require("path");

var pathname;// = urll.parse(req.url).pathname;
function myConFunc(req ,res) {
    pathname= urll.parse(req.url).pathname;
   
   // var root = pat.dirname(require.main.filename );

   // var filrePAth = root + "\" +  pathname.substr(1);
   // var hostStr = req.headers.host;  // urll.parse(req.url).hostname;
   // console.log(hostStr);
   // console.log(pathname);

    if (req.method == "POST") {
       // if (pathname.indexOf("/aljanin") < 0) req.connection.destroy();
        PocessPost(req, res);
      

    } else if (req.method == "GET") {
       
        generateHttpResponseFromFile(res, pathname);
      //  generateErrorHtml(res,"main Eror","yes");
    
    }

  
}

var srv = htp.createServer(myConFunc);
srv.listen(8080);



function PocessPost(request, response) {
    
        var body = '';

        request.on('data', function (data) {
            body += data;

            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6)
                request.connection.destroy();
        });

        request.on('end', function () {
            var post =( JSON.parse(body));
            switch (pathname)
            {
                case "/auth":
                    generateHttpResponseFromFile(response, "/api/sms.html");
                    break;
                case "/postsms":
                    var Headers = { 'Content-Type': 'text/html' };
                    response.writeHead(200, Headers);
                    response.write("Thank you");
                    response.end();
                      
                    break;
                default:
                    break;
            }
                    
            //response.end();
        });
   
}

function generateHttpResponseFromFile(response, pathname)
{
    var howManyFilesFound = 0;
    // Read the requested file content from file system
    //It will also read the incuded files in the html document
    fs.readFile( pathname.substr(1), function (err, data) {
        if (err) {
            console.log(err);
           
            // HTTP Status: 404 : NOT FOUND
            // Content Type: text/plain
          //  response.writeHead(500, { 'Content-Type': 'text/html' });
        }
        else {
            //Page found	  
            // HTTP Status: 200 : OK
            // Content Type: text/plain
            var Headers = { 'Content-Type': 'text/html' };
            if (pathname.indexOf(".css") < 0) {
                var Headers = { 'Content-Type': 'text/html' };
            } else {
                var Headers = { 'Content-Type': 'text/css' };
            }

            response.writeHead(200, Headers);
         
           
            // Write the content of the file to response body
            response.write(data);
            howManyFilesFound++;
          
        }
        if (howManyFilesFound == 0) // an included file couldn't be opened
        {
            response.writeHead(404, { 'Content-Type': 'text/html' });
        }
        response.end();
        
    });
  
}

function generateErrorHtml(response,mainError,subError) {

    fs.readFile("api/error.html", function (err, data) {
        var Headers = { 'Content-Type': 'text/html' };
        response.writeHead(200, Headers);
      

        if (err)
        {
            response.write(err.message);
            console.log(err);
            data = err.toString().replace("myErrorMessage", err.message);    
            data = err.toString().replace("ErrorCode=500", err.message);
        }
        else
        {
                               
            data = data.toString().replace("myErrorMessage", mainError);
            data = data.toString().replace("ErrorCode=500", subError);
         
            response.write(data.toString());
    
        }
       
        response.end();

    });
}
