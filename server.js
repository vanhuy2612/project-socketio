'use strict' 

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Loads the handlebars module
var hbs = require('express-hbs');

// Use `.hbs` for extensions and find partials in `views/partials`.
app.engine('hbs', hbs.express4({
  partialsDir: __dirname + '/views/partials'
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
// view engine setup

app.use(express.static('public'))
// Router : 
app.use('/', require('./routes/index'))

let server = require('http').createServer(app);

const io = require('socket.io')(server);

io.on('connection', socket => {
    
})

server.listen(3000, () => {
    console.log("Server is running at port 3000");
})