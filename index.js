var Campi = require('campi'),
    app = require('express')(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    base64 = require('base64-stream');

const errorLog = require('./util/logger').errorlog;
const successlog = require('./util/logger').successlog;

var numClients = 0;
    
var campi = new Campi();

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {

    socket.on("clientMsg", function (data) {
        successlog.info(`Client user agent : ${data}`);
    });

    numClients++;
    io.emit('stats', { numClients: numClients });

    successlog.info(`Connected clients: ${numClients}`);
    //console.log('Connected clients:', numClients);

    socket.on('disconnect', function() {
        numClients--;
        io.emit('stats', { numClients: numClients });

        successlog.info(`Connected clients: ${numClients}`);
        //console.log('Connected clients:', numClients);
    });
});


http.listen(3000, function () {
    var busy = false;
    console.log('listening on port 3000');

    setInterval(function () {
        if (!busy && numClients>0) {
            busy = true;
            campi.getImageAsStream({
                width: 640,
                height: 480,
                shutter: 200000,
                timeout: 1,
                nopreview: true
            }, function (err, stream) {
                var message = '';

                var base64Stream = stream.pipe(base64.encode());

                base64Stream.on('data', function (buffer) {
                    message += buffer.toString();
                });

                base64Stream.on('end', function () {
                    io.sockets.emit('image', message);
                    busy = false;
                });
            });
        }
    }, 100);
});