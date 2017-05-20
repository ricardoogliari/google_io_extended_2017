var five = require("johnny-five");
var board = new five.Board();

var firebase = require('firebase');
var config = {
    apiKey: "AIzaSyC1FTk06n1FOMFTVnTGn5t6PiALVFVmsw0",
    authDomain: "expush-4b02e.firebaseapp.com",
    databaseURL: "https://expush-4b02e.firebaseio.com",
    storageBucket: "expush-4b02e.appspot.com",
    messagingSenderId: "881493900622"
  };
firebase.initializeApp(config);

var buzzer, foraLadoGaragem, cozinha, sala, fora, dormitorio, garagem;

var express = require('express');
var app = express();

var server = app.listen(8088);

var ligarForaLadoGaragem = false;
var ligarCozinha = false;
var ligarSala = false;
var ligarFora = false;
var ligarDormitorio = false;
var ligarGaragem = false;


board.on("ready", function() {
   buzzer = new five.Led(7);
   foraLadoGaragem = new five.Led(8);
   cozinha = new five.Led(9);
   sala = new five.Led(10);
   fora = new five.Led(11);
   dormitorio = new five.Led(12);
   garagem = new five.Led(13);

   var starCountRef = firebase.database().ref('luzes');
	starCountRef.on('value', function(snapshot) {
	  	ligarForaLadoGaragem = snapshot.val().foraLadoGaragem;
		ligarCozinha = snapshot.val().cozinha;
		ligarSala = snapshot.val().sala;
		ligarFora = snapshot.val().fora;
		ligarDormitorio = snapshot.val().dormitorio;
		ligarGaragem = snapshot.val().garagem;

	  	ligarForaLadoGaragem ? foraLadoGaragem.on() : foraLadoGaragem.off();
		ligarCozinha ? cozinha.on() : cozinha.off();
		ligarSala ? sala.on() : sala.off();
		ligarFora ? fora.on() : fora.off();
		ligarDormitorio ? dormitorio.on() : dormitorio.off();
		ligarGaragem ? garagem.on() : garagem.off();

		
	});

	  var light = new five.Light("A0");
	  light.on("change", function() {
	    console.log(this.level);
	    /*var ligar = this.level > 40;
		ligar ? foraLadoGaragem.on() : foraLadoGaragem.off();
		ligar ? cozinha.on() : cozinha.off();
		ligar ? sala.on() : sala.off();
		ligar ? fora.on() : fora.off();
		ligar ? dormitorio.on() : dormitorio.off();
		ligar ? garagem.on() : garagem.off();
	    */
	  });

});

app.get('/all/:acao', function(req, res){
    console.log('entrou');
    var ligar = req.params.acao.valueOf() == new String("on").valueOf();
    console.log('testou se é igual  e: ' + ligar); 
    ligar? console.log("ligar") : console.log("não ligar");
    ligar ? buzzer.on() : buzzer.off();
	ligar ? foraLadoGaragem.on() : foraLadoGaragem.off();
	ligar ? cozinha.on() : cozinha.off();
	ligar ? sala.on() : sala.off();
	ligar ? fora.on() : fora.off();
	ligar ? dormitorio.on() : dormitorio.off();
	ligar ? garagem.on() : garagem.off();

	ligarForaLadoGaragem = ligar;
	ligarCozinha = ligar;
	ligarSala = ligar;
	ligarFora = ligar;
	ligarDormitorio = ligar;
	ligarGaragem = ligar;
	sendToFirebase();
    
	res.send('entrou: ' + req.params.comodo + " - " + req.params.acao);
});

function sendToFirebase(){
	firebase.database().ref('luzes').update({
			    cozinha : ligarCozinha,
			    dormitorio : ligarDormitorio,
			    fora : ligarFora,
			    foraLadoGaragem : ligarForaLadoGaragem,
			    garagem : ligarGaragem,
			    sala : ligarSala
			});
}

app.get('/:comodo/:acao', function(req, res){
    console.log('entrou');
    var ligar = req.params.acao.valueOf() == new String("on").valueOf();
    console.log('testou se é igual  e: ' + ligar); 
    ligar? console.log("ligar") : console.log("não ligar");
    switch (req.params.comodo){
    	case 'buzzer':
    		ligar ? buzzer.on() : buzzer.off();
    		break;
    	case 'foraLadoGaragem':
    		ligar ? foraLadoGaragem.on() : foraLadoGaragem.off();
    		ligarForaLadoGaragem = ligar;
    		sendToFirebase();
    		break;
    	case 'cozinha':
    		ligar ? cozinha.on() : cozinha.off();
    		ligarCozinha = ligar;
    		sendToFirebase();
    		break;
   		case 'sala':
   			ligar ? sala.on() : sala.off();
   			ligarSala = ligar;
    		sendToFirebase();
    		break;
    	case 'fora':
    		ligar ? fora.on() : fora.off();
    		ligarFora = ligar;
    		sendToFirebase();
    		break;
    	case 'dormitorio':
    		ligar ? dormitorio.on() : dormitorio.off();
    		ligarDormitorio = ligar;
    		sendToFirebase();
    		break;
    	case 'garagem':
    		ligar ? garagem.on() : garagem.off();
    		ligarGaragem = ligar;
    		sendToFirebase();
    		break;

    }
	res.send('entrou: ' + req.params.comodo + " - " + req.params.acao);
});
