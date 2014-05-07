/**
 * Created by JoinTheSecta on 01/05/14.
 */

//soc = io.connect('http://148.251.21.152:3000');
soc = io.connect('http://localhost:3000');

var id = 0;
var username = '';
var contrincante = '';

$('#insertUser').hide();

$('#buttonServer').on('click', function () {
    username = $('#nameInput').val();
    console.log("username: " + username);
    soc.emit('addUser', username);
});

soc.on('usersOnline', function (users) {

    $('#userList').html("");
    var contador = Object.keys(users).length;

    console.log('Numero de usuarios:' + contador);

    if (contador <= 1) {
        $('#usersHeader').html("No hay usuarios conectados!");
    } else {
        $('#usersHeader').html('Usuario conectados');
    }

    for (user in users) {
        console.log("User: " + user);
        console.log("Usuario: " + users[user].username);
        console.log("ID usuario: " + users[user].id);
        if (user != id) {
            $('#userList').append('<a id="' + user + '"><li class="topcoat-list__item">' + users[user].username + '</li></a>');
            $('#' + user).on("click", function () {
                $('#userList a li').attr('class', 'topcoat-list__item');
                $(this).children("li").addClass("itemSelected");
                contrincante = $('#userList a').attr('id');
                console.log("Contrincante: " + contrincante);
            });
        }
        contador++;
    }
});

soc.on('welcome', function (user) {
    $('#newUserForm').hide();
    $('#insertUser').show();
    $('#welcome').html('Bienvenido ' + user.username);
    id = user.id;
    username = user.username;
});

soc.on('aceptarPartida', function (user) {
    console.log('Contrincante --> ' + user.player2);
    console.log(user.player1 + ' contra ' + user.player2);
    $('#user1').append(user.player1 + '<img src="img/whiteStick.png" height="18px;" width="10px;">');
    $('#user2').append(user.player2 + '<img src="img/blueStick.png" height="18px;" width="10px;">');
    $('#turnGame').append('Turno para ' + user.player1);
    startGame();
});

soc.on('recibirSincronizacion', function (data) {
    gameState = data;
    refreshGameState();
});

soc.on('userPlaying', function (user) {
    alert('El usuario ' + user + ' esta actualmente jugando una partida');
});

soc.on('playerOut', function () {
     alert('Tu contrincante ha abandona :(');
});

/*
 soc.on('lastOnline', function (users) {
 if (users.id) {
 $('#log').append('<button class="chat" value="' + users.id + '">' + users.username + '</button>');
 }
 });

 $('#online').on('click', '.chat', (function () {
 soc.emit('newChat', {id: this.value});
 alert(this.value);
 }));

 soc.on('newMessage', function () {
 alert('quiers hablar contigo');
 });

 soc.on('initChat', function (usersChat) {
 $('#initChat').show();
 var elements = $();
 elements = elements.add('<button class="sendChatMessage" value="' + id + '">Enviar</button>');
 $('#buttonEnviar').append(elements);
 $('#usersChat').append('<p>'+ usersChat.username1 + '</p>' +
 '<p>'+ usersChat.username2 + '</p>' +
 '<input type="hidden" id="receptor" value="'+ usersChat.id +'"></input>');
 });

 $('#initChat').on('click', '.sendChatMessage', (function () {
 var receptor = $('#receptor').val();
 soc.emit('newMessage', {message: $('#chatMessage').val(), id: receptor});
 $('#chatUsersMessages').append('<p>' + username + ': ' + $('#chatMessage').val());
 }));

 soc.on('newChatMessage', function (data) {
 $('#chatUsersMessages').append('<p>' + data.username + ': ' + data.message);
 });


 soc.on('error', function (reason) {
 console.error('Unable to connect Socket.IO', reason);
 });

 $('#join').click(function () {
 soc.emit('addUser', $('#user').val());
 });



 */