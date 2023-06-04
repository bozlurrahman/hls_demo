var http = require('http');
var fs = require('fs');

const port = 8500
// https://medium.com/sharma02gaurav/adaptive-bitrate-streaming-hls-vod-service-in-nodejs-8df0d91d2eb4
// https://www.unified-streaming.com/solutions/audio-streaming
// https://hlsjs.video-dev.org/demo/
// https://ffmpeg.org/ffmpeg.html


http.createServer(function (request, response) {
    console.log('request starting...');

    var filePath = './temp/chunks' + request.url;

    fs.readFile(filePath, function(error, content) {
        response.writeHead(200, { 'Access-Control-Allow-Origin': '*' });
        if (error) {
            if(error.code == 'ENOENT'){
                fs.readFile('./404.html', function(error, content) {
                    response.end(content, 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                response.end(); 
            }
        }
        else {
            response.end(content, 'utf-8');
        }
    });

}).listen(port);
console.log(`Server running at http://127.0.0.1:${port}/`);
