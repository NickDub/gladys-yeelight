![gladys version](https://badgen.net/badge/Gladys/%3E=%203.9/purple)
![license](https://badgen.net/github/license/NicolasD-62/gladys-yeelight/test)
[![dependencies Status](https://badgen.net/david/dep/NicolasD-62/gladys-yeelight/test)](https://david-dm.org/NicolasD-62/gladys-yeelight/test)

# gladys-yeelight
Gladys module to control your Yeelight wifi bulbs.

yeelight2 - https://github.com/song940/node-yeelight
yeelight.js - https://github.com//kbariotis/yeelight.js ???

## Prerequisites

* Gladys version >= 3.9 
* Yeelight wifi bulbs (supported model listed below). 
    * Smart LED Bulb  ( Tunable White ) 
    * LED Bulb (Color) 
    * Smart LED Bulb (Color) 
    * LED Desk Lamp ( Tunable White ) 
    * Lightstrip (Color) 
    * LED Ceiling Light 

## Installation

1. Install the module through Gladys modules pannel and reboot Gladys when it's done. 
2. Go to the modules pannel and click 'Config'. This process takes around 8 secondes to complete. 
3. Your bulbs should now be listed in the devices pannel. If they are not, feel free to repeat step 2. 

DO NOT FORGET TO ENABLE DEVELOPER MODE IN YOUR BULBS SETTINGS FROM THE YEELIGHT PHONE APP. 

## Usage

After installation is done, you can control power, brightness, hue and saturation for each bulb in the devices pannel. 
If you need more complex things to happen, you can also call the 'send' function from scripts: 
```javascript
gladys.modules.yeelight.send({id: device_id, method: 'method_name', params: []});
```
Methods names and their corresponding parameters can be found on the Yeelight API spec document: 
http://www.yeelight.com/download/Yeelight_Inter-Operation_Spec.pdf 

There's one exception though: the 'set_rgb' function requires an array [R, G, B] as first parameter instead of an integer. 

Some examples: 
```javascript
gladys.modules.yeelight.send({identifier: '0x0000000000000000', method: 'toggle'});
gladys.modules.yeelight.send({identifier: '0x0000000000000000', method: 'set_rgb', params: [[32, 0, 255], 'smooth', 1000]});

gladys.modules.yeelight.send({identifier: '0x0000000000000000', method: 'set_power', params: ['on']});
gladys.modules.yeelight.send({identifier: '0x0000000000000000', method: 'set_hsv', params: ['', 47]}); // Keep the current hue and set saturation to 47
```
