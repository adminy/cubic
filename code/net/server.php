<?php
set_time_limit(0);																														// prevent the server from timing out
require '../lib/sockets.php';
class Cubik extends WebSocketServer {
  protected function process($client, $message) {
    echo "Received: ".$client->id.':'.$message.PHP_EOL;	    //print what client has sent to the server

        foreach($this->users as $connected_user)
			$this->send($connected_user,$message);
  }
 
  protected function connected($client) {
	echo "Connected: ".$client->id.PHP_EOL;
  }

  protected function closed($client) {
	echo "Disconnected: ".$client->id.PHP_EOL;
  }

  protected function tick() {
	  //main loop ticks every milisecond
  }

  protected function connecting($client) {
  	echo "Connecting: ".$client->id.PHP_EOL;
  	
  }
  
  protected function connect($socket) {
    $client = new $this->userClass(uniqid('u'), $socket);
    $this->users[$client->id] = $client;
    $this->sockets[$client->id] = $socket;
    $this->connecting($client);
  }
  
  
}

$server = new Cubik("localhost", "8888"); //ip, port, size_bytes
try {
	$server->run();
		
} catch (Exception $e) {
	$server->stdout($e->getMessage());
}



