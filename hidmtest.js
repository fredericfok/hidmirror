HidMirror = require('./HidMirror.js'); 

var mirror = new HidMirror (); 

mirror.start(); 

mirror.on("hidm_up", function (data){
    console.log("-> mir:ror up");
}); 
mirror.on("hidm_down", function (data){
    console.log("-> mir:ror down");
}); 
mirror.on("hidm_in", function (data){
    console.log("-> mir:ror RFID IN --> ID =>> "); console.log(data);
}); 
mirror.on("hidm_out", function (data){
    console.log("-> mir:ror RFID OUT --> ID =>> "); console.log(data);
}); 
mirror.on("hidm_started", function (data){
    console.log("-> mir:ror READY "); 
}); 
mirror.on("hidm_stopped", function (data){
    console.log("-> mir:ror STOPPED "); 
}); 