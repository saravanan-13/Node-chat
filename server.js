//var express = require("express");
var mysql = require('mysql');
//var app = express();
//var bodyParser = require('body-parser');
/*
path = require("path");
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', express.static(__dirname + '/css'));
app.use(bodyParser.json());
*/
var client = require('socket.io').listen(8200).sockets;

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'saravanan13',
    database: 'test'
});
connection.connect(function(err, db) {
    if (err) {
        console.log("Error connecting database ... nn");
    }
    client.on('connection', function(socket) {

        sendStatus = function(s) {
            socket.emit('status', s);
        };

        // emit all chat-messages
        connection.query('SELECT * FROM chat', function(err, rows, fields) {

            if (err) throw err;

            socket.emit('output', rows);

        });



        socket.on('input', function(data) {
            var users = {
                "name": data.name,
                "message": data.message
            }
            whitespacePattern = /^\s*$/;

            if (whitespacePattern.test(users.name) || whitespacePattern.test(users.message)) {
                sendStatus('Name and Message is required !');
            } else {
                connection.query('INSERT INTO chat SET ?', users, function(error, results, fields) {
                    if (error) {
                        console.log("error ocurred", error);
                    } else {

                        // emit latest message to all client
                        client.emit('output', [data]);

                        sendStatus({
                            message: "Message sent",
                            clear: true
                        });
                    }
                });
            }

        })
    });


});