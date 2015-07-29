#!/bin/sh

# detection interval, by default 5000 ms 
export HIDM_DETECT_INTERVAL=5000 
# auto restart , by default true 
export HIDM_AUTO_RESTART=true 

node hidmtest.js
