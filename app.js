var express = require('express');
var app = express.createServer();

app.configure(function(){
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(app.router);
});

app.configure('development', function(){
    app.use(express.static(__dirname + '/public'));
    // app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

var io = require('socket.io').listen(app);


// Log Level
// 0, 1, 2, 3
io.configure('development', function(){
	io.set('log level', 3);
});

//  Get the environment variables we need.
//var port    = process.env.npm_package_config_port;
var port      = 8888;

// Use the socket.io logger
var Logger = io.sockets.log;

//  And start the app on that interface (and port).
app.listen(port);

Logger.info("Running on port: " + port);

var current_player = null;

io.sockets.on('connection', function (socket) {
	
	// Obtenemos la instancia para poder loguear
	var self = this;
	
	// Encolar jugador
	socket.on('queue', function(data) {
		var auth_id = data.auth_id;
		
		// Cargamos esta variable para verificar que el jugador actual es el enviado
		current_player = auth_id;
		
		this.log.info("Agregando nuevo jugador: "  + current_player);
	})
	
	// Desencolar jugador
	socket.on('dequeue', function() {
		if (current_player !== null) {
			this.log.info("Borrando jugador actual: "  + current_player);
			
			// Borramos el jugador
			current_player = null;
		}
	})
	
	// Logueamos cualquier mensaje al servidor
	socket.on('message', function(message, callback) {
		this.log.info(message);
	})
	
	// When user press "Play" Button
	socket.on('play', function (data) {
		
		this.log.info("Verificando (data.auth_id == current_player): " + data.auth_id + " == " + current_player);
		
		if (data.auth_id == current_player) {
			socket.broadcast.emit('player_ready', {
				'player_id': data.auth_id
			});
		} else {
			socket.broadcast.emit('unauthorized', {
				'current_player': current_player
			});
		}
	});
	
	// Show gamepad to player
	socket.on('show_gamepad', function (data) {
		
		this.log.info("Preparando controles para el jugador:" + data.auth_id);
		
		socket.broadcast.emit('show_gamepad', {
			"player_id": data.auth_id
		});
	});
	
	// Gamepad controls
	socket.on('control', function (data) {
		socket.broadcast.emit('move', {
			'data': data
		});
	});
	
	// Game over
	socket.on('gameover', function (data) {
		
		this.log.info("Termino el turno de: " + current_player);
	
		socket.broadcast.emit('gameover_redir', {
			'player_id': current_player
		});
		
	});
	
	
});
