var ws, textbox;

function connect() {
	ws = new WebSocket("ws://localhost:8888");
	ws.onmessage = function(response) {
		console.log(response.data);
	}
	ws.onopen = function() {
		textbox = document.getElementById("textbox");
		textbox.addEventListener("keydown", sendMessage);
	}
}

function sendMessage(e) {
	if(e.keyCode==13) {
		//console.log(textbox.value);
		ws.send(textbox.value);
	}
}

window.onload = connect;

