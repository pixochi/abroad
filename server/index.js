var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');
var morgan = require('morgan');
var passport = require('passport');
var compression = require('compression');

var sequelize = require('sequelize');

var db = require('./db/models');
// import UserGroup from './db/models/UserGroup';
// var UserGroup = require('./db/models/UserGroup');
const UserGroup = require('./db/models');

app.use(compression());

app.set('port', (process.env.PORT || 3001));
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}


app.use(passport.initialize());
if (process.env.NODE_ENV != 'production') {
  app.use(express.static(__dirname + '/public'));
}
app.use(express.static('./uploads'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// mongoose.Promise = global.Promise; only if the browser-console shows promise Warning
mongoose.connect("mongodb://abroad:dansko123@ds113650.mlab.com:13650/abroad", function(err) {
  if(err) console.log(err);
});



//Socket namespaces

//socket for real time comment loading
var postSocket = io.of('/post');
var connections = [];

postSocket.on('connection', function(socket) {
	connections.push(socket.id);
	socket.on('roomPost', function(room) {
		socket.join(room);
	});	

	

	socket.on('disconnect', function(s) {
		connections.splice(connections.indexOf(s.id), 1);
	});
});

//socket for real time notifications
var notificationSocket = io.of('/notif');
notificationSocket.on('connection', function(socket) {
	connections.push(socket.id);

	socket.on('room', function(room) {
		socket.join(room);
	});	

	socket.on('subscriptionRoom', function(room) {
		socket.join(room);
	});	

	socket.on('disconnect', function(s) {
		connections.splice(connections.indexOf(s.id), 1);
	});
});


//Routes
var UserRoutes = require('./routes/user')(notificationSocket);
var PostRoutes = require('./routes/posts')(postSocket, notificationSocket);
var CommentRoutes = require('./routes/comments')(postSocket, notificationSocket);
var AuthenticationRoutes = require('./routes/auth')(notificationSocket);
var NotificationRoutes = require('./routes/notifications')(notificationSocket);

app.use(PostRoutes);
app.use(UserRoutes);
app.use(CommentRoutes);
app.use(AuthenticationRoutes);
app.use(NotificationRoutes);

if(process.env.NODE_ENV === 'production') {
	app.get('*', function(req, res) {
	  res.sendFile(path.join(__dirname, 'client/build/index.html'));

	});
}

db.sequelize.sync({ force: true }).then(function() {
	http.listen(app.get('port'), () => {
	  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
	});
});



