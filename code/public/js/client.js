var ws;

window.onload = function() {
  ws = new WebSocket("ws://ie.dyndns.tv")
  ws.onopen = function(e) { console.log("User Connected") }
  ws.onmessage = function(response) {
    console.log(response.data);
  }
  ws.onerror = ws.onclose = function() { /* attempt reconnect / recovery */ }
}
