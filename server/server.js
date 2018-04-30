const
    express = require('express'),
    path = require('path')

const
    app = express(),
    server = require('http').Server(app)

app.use(express.static('../client'))
require('./sockets')(server)


server.listen(8080)
