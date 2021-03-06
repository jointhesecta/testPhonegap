/**
 * Created by ricardo on 27/04/14.
 */

var numSticks = 0;
var totalSticks = 36;
var lastSticksSelected = [];
var turn = 1;

document.addEventListener('deviceready', function () {

    $('#iniciar').click(function () {
        $('#iniciar').hide();
        $('#game').show();
        $('.game').show();
        $('#iconReplay').show();
        $('.inicio').hide();
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
                    if(lastSticksSelected.length > 1){
                        if (equalRow() && consecutiveStick()) {
                            selectStick(elementTouching);
                        } else {
                            restartSelected();
                        }
                    }{
                        selectStick(elementTouching);
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

function onConfirm(buttonIndex) {
    if (buttonIndex === 2) {
        $('#game').hide();
        $('#index').show();
        $('#iniciar').show();
    }
}

function changeTurn() {
    if (lastSticksSelected.length < 1) {
        navigator.notification.alert(
            'Tienes que seleccionar un palo para cambiar el turno',    // message
            null,       // callback
            "Game Test", // title
            'OK'        // buttonName
        );
    } else {

        for (var i = 0; i < lastSticksSelected.length; i++) {
            lastSticksSelected[i].id = turn;
            numSticks++;
        }

        if (turn == 1) {
            if (numSticks === totalSticks) {
                navigator.notification.confirm(
                    'Jugador ' + turn + ', has perdido',  // message
                    onConfirm,              // callback to invoke with index of button pressed
                    'Game Over',            // title
                    'Restart,Exit'          // buttonLabels
                );
            }

            turn = 2;
            $('#turnGame').html('Turno jugador 2');
            if (numSticks === totalSticks - 1) {
                navigator.notification.confirm(
                    'Jugador ' + turn + ', has perdido',  // message
                    onConfirm,              // callback to invoke with index of button pressed
                    'Game Over',            // title
                    'Restart,Exit'          // buttonLabels
                );
            }
        } else {
            if (numSticks === totalSticks) {
                navigator.notification.confirm(
                    'Jugador ' + turn + ', has perdido',  // message
                    onConfirm,              // callback to invoke with index of button pressed
                    'Game Over',            // title
                    'Restart,Exit'          // buttonLabels
                );
            }
            turn = 1;
            $('#turnGame').html('Turno jugador 1');
            if (numSticks === totalSticks - 1) {
                navigator.notification.confirm(
                    'Jugador ' + turn + ', has perdido',  // message
                    onConfirm,              // callback to invoke with index of button pressed
                    'Game Over',            // title
                    'Restart,Exit'          // buttonLabels
                );
            }
        }
        lastSticksSelected = [];
    }
}

function restartSelected() {
    for (var st = 0; st < lastSticksSelected.length; st++) {
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
    var stiSel = [];
    for(var i = 0; i < lastSticksSelected.length; i++) {
        stiSel.push(parseInt(lastSticksSelected[i].id.split("-")[1].replace("stick", "")));
    }
    stiSel = stiSel.sort();
    var ordenado = false;
    for(var i = 0; i < stiSel.length - 1; i++) {
        if (stiSel[i] == (stiSel[i+1] - 1)){
            ordenado = true;
        }else{
            return false;
        }
    }
    return ordenado;
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