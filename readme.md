HID MIRROR
==========

Mir:ror node driver module providing utility methods to listen RFID tags (ISO/IEC 14443 Type A or B) such as nano:ztag or ztamps. 

It automatically detects the mir:ror when it is connected to your USB port, using a configurable time interval (default 5sec) 

The driver includes the following utility functions : 
    `start`  use it to start the driver
    `stop`   use it to stop the driver 
    
You get the following events from the driver : 
    `hidm_started`  indicate that the driver is ready to use 
    `hidm_stopped`  indicate that the driver is off 
    `hidm_up`       notify that the mir:ror is in the orientation 'up'  
    `hidm_down`     notify that the mir:ror is in the orientation 'down'
    `hidm_in`       notify a RFID tag entered on the mir:ror (detected in) with data being the identifier of the RFID tag
    `hidm_out`      notify a RFID tag left the mir:ror (detected out) with data being the identifier of the RFID tag 


Although the product is now end of life and no more used, you can find some information about `violet mir:ror` here : 
[Violet's Mirr:or: Internet of Things Via RFID](http://radar.oreilly.com/2008/09/violets-mirror-internet-of-thi.html)
[mir:ror](https://en.wikipedia.org/wiki/Mir:ror)


## Installation

```shell
  npm install hidmirror --save
```

## Usage

```js
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

```

## env variables 

You may configure the following variables, at your convenience : 
```shell
# detection interval (default is 2000 ms) : check if mir:ror device is connected every X ms
export HIDM_DETECT_INTERVAL=5000 
# auto restart (default is true) : if the device connection stops then it automatically restarts
export HIDM_AUTO_RESTART=false 
```

## Contributing

You are welcome to contribute : 
* improve detection of the device 
* control sounds and led ... 

## Release History

* 1.0.0 driver up and running enabling RFID tag detection 
* 0.1.0 Initial release