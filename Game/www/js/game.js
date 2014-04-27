/**
 * Created by ricardo on 27/04/14.
 */

var numSticks = 0;
var totalSticks = 10;
var lastSticksSelected = [];
var turn = 1;

document.addEventListener('deviceready', function () {
    $('#game').hide();
    $('#iniciar').click(function () {
        $('#iniciar').hide();
        $('#game').show();
        $('#log').prepend("Empieza el juego");
    });

    // Nuevo codigo

    document.getElementById('game').addEventListener('touchmove', function (event) {
        event.preventDefault();
        for (var i = 0; i < event.touches.length; i++) {
            var touch = event.touches[i];

            var elementTouching = document.elementFromPoint(
                touch.pageX,
                touch.pageY
            );

            var id = elementTouching.id;
            if (id != undefined) {
                if (id.indexOf("fila") != -1) {
                    //var fila = id.split("-")[0].replace("fila","");
                    //var stick = id.split("-")[1].replace("stick","");
                    //$('#log').prepend("<p> stick: "+ elementTouching.id +"</p>");
                    addStick(elementTouching);
                    if (equalRow()) {
                        selectStick(elementTouching);
                    } else {
                        restartSelected();
                    }
                }
            }
        }
    }, false);

});

function addStick(stick) {
    //if($.inArray(stick,lastSticksSelected) == -1){
    if (lastSticksSelected.indexOf(stick) == -1) {
        lastSticksSelected.push(stick);
        $('#log').prepend("<p> Añadido: " + stick.id + "</p>");
    }
}

function changeTurn() {
    if (lastSticksSelected.length < 1) {
        alert('Tienes que seleccionar un palo para cambiar el turno');
    } else {
        var i = 0;

        for (i = 0; i < lastSticksSelected.length; i++) {
            lastSticksSelected[i].id = 1;
            numSticks++;
        }
        if (numSticks === 10 || numSticks === 9) {
            alert('Jugador '+turn +', has perdido');
        }

        if (turn == 1) {
            turn = 2;
        } else {
            turn = 1;
        }

        lastSticksSelected = [];
        $('#log').prepend("<p> Usuario : " + turn + "</p>");
    }
    lastSticksSelected = [];
    $('#log').prepend("<p> Usuario : "+ turn +"</p>");
}

function restartSelected(){
    for(var st = 0; st < lastSticksSelected.length; st++){
        lastSticksSelected[st].src = "assets/img/Stick.png";
    }
    lastSticksSelected = [];
}

function equalRow() {
    //$('#log').prepend("<p> length:"+lastSticksSelected.length +"</p>");

    if (lastSticksSelected.length <= 1) {
        return true;
    }

    var rowSel = lastSticksSelected[0].id.split("-")[0].replace("fila", "");

    for (var st = 1; st < lastSticksSelected.length; st++) {
        if (rowSel != lastSticksSelected[st].id.split("-")[0].replace("fila", "")) {
            return false;
        }
        rowSel = lastSticksSelected[st].id.split("-")[0].replace("fila", "");
    }

    return true;
}

function consecutiveStick(){
    if(lastSticksSelected.length <= 1){
        return true;
    }

    for(var st = 1; st < lastSticksSelected.length; st++){
        var stiSel = lastSticksSelected[0].id.split("-")[1].replace("stick","");

    }
}

function selectStick(stick) {
    switch (turn) {
        case 1:
            stick.src = "assets/img/whiteStick.png";
            break;
        case 2:
            stick.src = "assets/img/blueStick.png";
            break;
        default:
            $('#log').prepend("<p> FIN DEL JUEGO! </p>");
    }
}