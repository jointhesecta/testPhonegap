/**
 *  Created by Ricardo Martinez - JTS on 29/04/2014.
 *  e-mail: info@jointhesecta.com
 */

"use strict";

var socket = io.connect('http://148.251.21.152:3000');

$('#buttonServer').click(function () {
    var prueba = $("#prueba").val();
    alert(prueba);
    socket.emit('addUser', prueba);
});
