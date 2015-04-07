//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/string/rot13 [rev. #1]

String.prototype.r = function(){
    return this.replace(/[a-zA-Z]/g, function(c){
        return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
    });
};

window.constants = {};

var constants = window.constants;

jQuery(document).ready(function($){
	
	var SEARCH_PLAYERS = true;
	var GAME_READY = false;
	
	constants.player_id = null;
	
	var baseURL = "http://" + window.location.hostname;
	var socket = io.connect(baseURL);
	var roomURL = baseURL + ":8080/mobile.html";
	
	// Emitted when the socket is attempting to connect with the server
	socket.on('connecting', function () {
		socket.send('Mostrando pantalla de descanso.');
	});
	
	// Emitted when the socket connected successfully 
	socket.on('connect', function () {
		// Borramos cualquier posible jugador encolado
		socket.emit('dequeue');
	});
	
	socket.on('player_ready', function (resp) {
		
		if (GAME_READY === true) {
			
			GAME_READY = false;
			
			SEARCH_PLAYERS = false;
			
			// console.log(resp);
			
			constants.player_id = resp.player_id;
			
			var jqxhr = $.ajax({
				url: "http://tigobreakout-openmobile.rhcloud.com/api/dequeue",
				data: {
					'auth_id' : constants.player_id
				},
				dataType: "json",
				cache: false,
				type: "POST",
				timeout: 15000,
				beforeSend: function() {
					$('#ajax_loader > h2').html('Cargando juego ...');	
					$('.wrapper').hide();
					$('#ajax_loader').fadeIn('slow');
				},
				success: function(data) {
					if (data.success === true) {
						// Tratamos de mostrar los controles al usuario
						socket.emit('show_gamepad', {
							"auth_id": constants.player_id
						});
						
						// Redireccionamos al juego
						window.location.href = 'index.html?auth_id=' + constants.player_id;
					}
				},
				error: function (jqXHR, textStatus, errorThrown) {
					socket.send("Error en la peticion Ajax. Se procede a recargar la pagina debido a los siguientes errores");
					socket.send("jqXHR: " + jqXHR);
					socket.send("Status: " + textStatus);
					socket.send("errorThrown: " + errorThrown);
					// Recargamos
					window.location.reload();
				}
			});
		}
	});
		
	// Sirve para paginar la lista de jugadores
	var offset_index = 0;
	
	function getQueue(offset) {
		
		// Creamos una bandera para para la busqueda en caso de que el usuario haya presionado "Play"
		if (SEARCH_PLAYERS === false) return;
		
		socket.send('Buscando jugadores ...');
		
		offset = offset_index;
		
		var jqxhr = $.ajax({
			url: "http://tigobreakout-openmobile.rhcloud.com/api/nextPlayer",
			data: {
				'offset' : offset
			},
			dataType: "json",
			cache: false,
			type: "POST",
			timeout: 15000,
			beforeSend: function() {
				$('#ajax_loader > h2').html('Buscando jugadores ...');	
				$('.wrapper').hide();
				$('#ajax_loader').fadeIn('slow');
			},
			success: function(data) {
				if (data.resetOffset === true) {
					offset_index = 0;
					offset = offset_index;
				}
				
				if (data.success === true) {
					
					var player = data.player;
					var loader = $('#ajax_loader');
					
					$('#ajax_loader > h2').html('Cargando jugador ...');	
								
					loader.fadeIn('fast', function() {
						
						$('<img/>').load(function(e) {
							
							var img = this;
							
							loader.fadeOut('fast', function(e) {
															
								var profile = $("#profile_container");
							
								var time_per_player = 15;
								
								profile.html('<h1>Pr&oacute;ximo Jugador:</h1><h2>' + player.first_name + ', presion&aacute; JUGAR en tu tel&eacute;fono!</h2> <div class="avatar centered"><div id="light" class="light"></div></div><h1 id="time" class="time">00:' + time_per_player + '</h1>')
								$('#light').after(img);
								
									// EL jugador ya puede presionar Play			
									GAME_READY = true;
									
									socket.send('Jugador encontrado: ' + player.id);
									
									socket.emit('queue', { "auth_id": player.id });
									
									profile.fadeIn('fast', function () {
									
									var j = time_per_player;
									
									var interval = setInterval(function(){
										
										if (j == -1) {
											
											GAME_READY = false;
											
											// Quitamos el jugador de la cola del socket
											socket.emit('dequeue');
											
											clearInterval(interval);
											
											// console.log("Offset: " + offset);
											
											getQueue(++offset_index);
											
										} else {										
											$("#time").html("00:" + ((j < 10) ? '0' + j : j));	
										}
										
										j--;
									}, 999);
										
								});
								
								
								
							});
						})
						.error(function() {
							console.log("error loading image");
							getQueue(0);
						})
						.attr("src", "http://graph.facebook.com/" + player.id + "/picture?type=large")
						.attr("id", "profile_picture");
					});
				
				// Cuando no quedan mas jugadores en la cola, la busqueda comienza de nuevo
				} else {
											
					// Mostramos un mensaje de que no hay jugadores
					$(".wrapper").hide();
					
					$("#no_players").fadeIn("slow", function(){
						// Y luego volvemos a realizar la busqueda
						setTimeout(function(){					
							getQueue(0);
						}, 6000);
					});
				}
			},
			error: function (jqXHR, textStatus, errorThrown) {
				socket.send("Error al buscar jugadores");
				socket.send("jqXHR: " + jqXHR);
				socket.send("Status: " + textStatus);
				socket.send("errorThrown: " + errorThrown);
				// Recargamos
				window.location.reload();
			},
			complete: function() {
			}
		});
	}
	
	var body_dom = $("html");
	var w = body_dom.width();
	var h = body_dom.height();
	
	console.log(w + ' - ' + h);
	var m = parseInt(w / 30) + 1;
	var n = parseInt(h / 30) + 2;
	
	var boxes = m * n;
	
	var container = $('#container');
	
	var r = 1;
	var blue_flag = true;
	
	for (var i = 1; i <= boxes; i++) {
		if (r > 4) {
			r = 1;
		} else {
			container.append('<div id="box_' + i + '" data-color="' + r + '" class="box box_form_' + r + ' bg_gif"></div>');
			r++;
		}
	}
	var t = setTimeout(function() {
		container.fadeIn(2, function() {
		
			$('.canvas_wrapper').center().fadeIn(1500, function(){	
				setTimeout(function() {
					$('#welcome_screen').fadeOut('slow', function() {
						// Obtenemos la lista de jugadores mediante una peticion Ajax
						getQueue(offset_index);
						
					});
				}, 1000);
			});
			
		});
		clearTimeout(t);
	}, 1000);
});

function rand(inferior, superior) {
	numPosibilidades = superior - inferior
	aleat = Math.random() * numPosibilidades
	aleat = Math.floor(aleat)
	return parseInt(inferior) + aleat
} 

jQuery.fn.center = function () {
	this.css("position","absolute");
	this.css("top", (($("html").height() - this.outerHeight()) / 2) + 
											$("html").scrollTop() + "px");
	this.css("left", (($("html").width() - this.outerWidth()) / 2) + 
											$("html").scrollLeft() + "px");
	return this;
}