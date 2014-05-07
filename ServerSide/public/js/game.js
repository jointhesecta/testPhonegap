/**
 * Created by ricardo on 27/04/14.
 */

var numSticks = 0;
var totalSticks = 36;
var lastSticksSelected = [];
var turn = 1;

var gameState = {
  1:{
     1:0
  },
  3:{
      1:0,
      2:0,
      3:0
  },
  5:{
      1:0,
      2:0,
      3:0,
      4:0,
      5:0
  },
  7:{
      1:0,
      2:0,
      3:0,
      4:0,
      5:0,
      6:0,
      7:0
  },
  9:{
      1:0,
      2:0,
      3:0,
      4:0,
      5:0,
      6:0,
      7:0,
      8:0,
      9:0
  }
};


document.addEventListener('deviceready', function () {

    $('#iniciar').click(function () {
        console.log('Se inicia partida con ' + contrincante);
        soc.emit('iniciarPartida', contrincante);
        startGame();
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

function startGame() {
    $('#iniciar').hide();
    $('#panelInicial').hide();
    $('#game').show();
    $('.game').show();
    $('#iconReplay').show();
    $('.inicio').hide();
}

function addStick(stick) {
    //if($.inArray(stick,lastSticksSelected) == -1){
    if (lastSticksSelected.indexOf(stick) == -1) {
        lastSticksSelected.push(stick);
        // $('#log').prepend("<p> Añadido: " + stick.id + "</p>");
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
        //    lastSticksSelected[i].id = turn;
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

        soc.emit('pasarTurno', gameState);
        lastSticksSelected = [];
    }
}

function restartSelected() {
    for (var st = 0; st < lastSticksSelected.length; st++) {
        lastSticksSelected[st].src = "img/Stick.png";
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

function selectStick(st) {
    var row = st.id.split("-")[0].replace("fila", "");
    var stick = st.id.split("-")[1].replace("stick", "");
    gameState[row][stick] = turn;

    switch (turn) {
        case 1:
            st.src = "img/whiteStick.png";
            break;
        case 2:
            st.src = "img/blueStick.png";
            break;
        default:
            $('#log').prepend("<p> FIN DEL JUEGO! </p>");
    }
}

function refreshGameState(){
    console.log("refreshGameState");

    for(fila in gameState){
        for(stickTemp in gameState[fila]){
            switch (parseInt(gameState[fila][stickTemp])){
                case 0:
                    $('#fila'+fila+'-stick'+stickTemp).src = 'img/Stick.png';
                    break;
                case 1:
                    $("#fila"+fila+"-stick"+stickTemp).src = "img/blueStick.png";
                    break;
                case 2:
                    $("#fila"+fila+"-stick"+stickTemp).src = "img/whiteStick.png";
                    break;
                default :
                    console.log("ERROR");
                    break;
            }
        }
    }
}