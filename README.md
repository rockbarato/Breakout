# Openbrix

Videojuego basado en el Breakout original con algunas modificaciones


## Instalacion
===========================
### Instalar npm (node package manager)

```
	$ curl http://npmjs.org/install.sh | sh  
```

### Instalar Node.js
(npm ya viene con el.)


## Instalacion del Juego
========================
Descomprimir el archivo `openbrix-v1.4.1.tgz` del adjunto incluido

```
$ cd /path/to/your/project
$ tar zxvf openbrix-v1.4.1.tgz
$ cd package
$ npm install
```

### Levantando el juego

```
$ npm start

> openbrix@v1.4.1 start /Users/apple/Desktop/openbrix
> node app.js

   info  - socket.io started
   info  - Running on port: 8888
```

Despues de haber ejecutado el comando anterior, debemos ingresar a nuestro navegador y escribir:

```
http://IP_LOCAL:8888/qr.html
```

**Nota:** Debemos cambiar `IP_LOCAL` por la IP asignada a esa computadora, por ejemplo si la IP es `10.11.12.13`, pondriamos:

```
http://10.11.12.13:8888/qr.html
```

Nos saldria en la pantalla esto:

![image](http://cdn.enmimobi.com/tigobreakout/qr.png)

Para pasar a la pantalla para buscar jugadores hacemos click en "Ir al Juego":

![image](http://cdn.enmimobi.com/tigobreakout/break.png)

Si queremos parar podemos terminar el proceso como un demonio cualquiera. En caso de que se necesite que el juego corra en background(como demonio), podemos usar el siguiente comando:

```
$ nohup node simple-server.js > openbrix.log &
[1] 4962
```

Para loguear el juego:

```
$ tail -f openbrix.log
```

Notese que nos devuelve el PID para poder matar el demonio

```
$ ps aux | grep node
apple	4962   0.1  0.4  3048984  15976 s001  S    11:00AM   0:00.51 node app.js
$ kill -9 4962
[1]+  Killed: 9               nohup node app.js > openbrix.log
```

## Como Jugar
===========================

Desde nuestro smartphone debemos scanear el siguiente QR:

![image](http://cdn.enmimobi.com/tigobreakout/qrcode.gif)

O bien podemos ingresar en nuestro smartphone la siguiente URL:

[http://tigobreakout-openmobile.rhcloud.com/](!http://tigobreakout-openmobile.rhcloud.com/)

Nos encontrariamos con esta pantalla, en la cual pide que nos autentiquemos con el Facebook para poder usar nuestra informacion basica como el nombre y la foto de perfil durante el juego

![image](http://cdn.enmimobi.com/tigobreakout/game_connect.png?v2)

Despues de haber aceptado los permisos para la aplicacion pasariamos al menu del juego:


![image](http://cdn.enmimobi.com/tigobreakout/game_menu.png)

Para jugar debemos presionar el boton Reservar Turno que nos mostraria la pantalla de controles, y cuando nuestro nombre salga en la pantalla principal, debemos presionar "Jugar"

![image](http://cdn.enmimobi.com/tigobreakout/game_controls.png)


#### Autor: [Felix Ayala][0]

#### Contacto Tecnico: [Raul Giucich][1]

[0]: mailto:gnu@opentech.com.py
[1]: mailto:rgiucich@opentech.com.py