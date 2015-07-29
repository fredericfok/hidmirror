/**
 * F.Fok
 * https://github.com/fredericfok/hidmirror
 *
 * Copyright (c) 2015 Frederic Fok - Koff
 * Licensed under the Apache 2.0 license.
 */


var assert           = require('assert');
var EventEmitter     = require('events').EventEmitter; 
var util 		     = require('util'); 

/*

the protocol used follows reverse engineering studies here : http://blog.nomzit.com/2010/01/30/decoding-the-mirror-comms-protocol/

messages : 64-byte communications packets

    Size	   1 byte	        1 byte	      2 bytes	         1 byte	        59 bytes
    Meaning	   Interface ID	    Method ID	  Correlation ID     Data Length	Data, followed by zeroes


Meaning	            Interface	Method	CID	                             Data
Request mir:ror ID	  01	       01	CID	                             No parameters
Report mir:ror ID	  01	       02	CID from 0101 message	         mir:ror ID
Request orientation	  01	       03	CID	                             No parameters
Report oriented up	  01	       04	CID from 0103 message or zeroes	 No data
Report oriented down  01	       05	CID from 0103 message or zeroes	 No data
Report tag on	      02	       01	Zeroes 	                         ID from tag
Report tag off	      02	       02	Zeroes	                         ID from tag

*/

var HID = require('node-hid');

//var HID_MANUFACTURER = "Violet" ; 
var _HIDM_VENDOR_ID         = 7592 ; 
var _HIDM_PRODUCT_ID        = 4865 ; 
var _DETECT_TIME_INTERVAL   = process.env.HIDM_DETECT_INTERVAL || 2000 ; //ms
var _AUTO_RESTART           = process.env.HIDM_AUTO_RESTART    || true ; 

var HidMirror = function() {
    var hid;
    this.hidm_vendor_id     = _HIDM_VENDOR_ID ; 
    this.hidm_product_id    = _HIDM_PRODUCT_ID ; 
    this.detect_interval    = _DETECT_TIME_INTERVAL ; 
    this.isStarted          = false; 
    this.autorestart        = _AUTO_RESTART; 
    EventEmitter.call(this); 
}

util.inherits(HidMirror, EventEmitter); 

HidMirror.prototype.start = function () {
    this.loopback  = setInterval(getDev, this.detect_interval, this) ; 
    this.isStarted = true; 
}

function getDev(scope) {
    scope.devices = new HID.devices(scope.hidm_vendor_id, scope.hidm_product_id);
    if (!scope.devices.length) {
    } else {
        //console.log("[HidMirror] mir:ror found ! ");
        clearInterval(scope.loopback); 
        listenDev(scope) ; 
    }
}

function listenDev(scope) {
    //console.log("[HidMirror] listening device : "+scope.devices[0].path); 
    scope.hid = new HID.HID(scope.devices[0].path);
    scope.hid.write([0x3, 0x1]); //Disable sounds and lights
    scope.hid.on("data", onRead); 
    scope.hid.on("error", function(err) {
        console.log("ERROR"); console.log(err); 
        scope.stop(); 
    });
    scope.isStarted = true; 
    scope.emit('hidm_started'); 
    
    // listening for data from mir:ror 
    function onRead(data) {
        
      var interface_id ; 
      var method_id ; 
      var correlation_id ; 
      var data_length ; 
      var id ; 

      //read the 64 bytes message
      if (data[0] != 0) {

        interface_id    = data[0] ; 
        method_id       = data[1] ; 
        correlation_id  = data.slice(2,3) ; 
        data_length     = data[4] ; 
        id              = data.slice(5,5+data_length) ; 

        /*
        console.log(data); 
        console.log('interface id   : ' + interface_id); 
        console.log('method id      : ' + method_id); 
        console.log('correlation id : ' + data.readUInt16LE(2) ); 
        console.log('data length    : ' + data_length); 
        console.log('data           : '); console.log(id); 
        */

        switch (data[0]) {
        case 1:     //Orientation change
          switch (data[1]) {
          case 4:
            scope.emit('hidm_up'); 
            break;
          case 5:
            scope.emit('hidm_down'); 
            break;
          }
          break;
        case 2:     //RFID
          switch (data[1]) {
          case 1:
            scope.emit('hidm_in', id); 
            break;
          case 2:
            scope.emit('hidm_out', id); 
            break;
          }
          break;
        }
      }
    }
}

HidMirror.prototype.stop = function () {
    //console.log("[HidMirror] closing ..."); 
    if (this.started == true) { 
        clearInterval(getDev); 
        this.hid.close(); 
    }
    this.isStarted = false; 
    this.emit('hidm_stopped'); 
    if (this.autorestart == true) {
        this.start();    
    }
}

module.exports = HidMirror ; 