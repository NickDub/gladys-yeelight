var YeelightSearch = require('yeelight-wifi');
var Promise = require('bluebird');
var shared = require('./shared.js');

module.exports = function setup() {
	// Reset all instances 
	shared.instances = {};

	// Search all yeelight
	var yeelightSearch = new YeelightSearch();

	// When found...
	yeelightSearch.on('found', function(yeelight) {
		console.log(`Yeelight - Device found, id: ${yeelight.id}, type: ${yeelight.model}`);

		var newTypes = [
			{
				name : 'Power',
				type : 'binary',
				identifier : 'power',
				sensor : false,
				min : 0,
				max : 1
			},
			{
				name : 'Brightness',
				type : 'brightness',
				identifier : 'brightness',
				sensor : false,
				min : 1,
				max : 100
			}
		];

		var hsvTypes = [
			{
				name : 'Hue',
				type : 'hue',
				identifier : 'hue',
				sensor : false,
				min : 1,
				max : 359
			},
			{
				name : 'Saturation',
				type : 'saturation',
				identifier : 'saturation',
				sensor : false,
				min : 1,
				max : 100
			}
		];

		var name = 'Yeelight';
		switch (yeelight.model) {
		case 'mono':
			name += ' (White)';
			break;
		case 'color':
			name += ' (RGBW)';
			newTypes = newTypes.concat(hsvTypes);
			break;
		case 'stripe':
			name += ' (Stripe)';
			newTypes = newTypes.concat(hsvTypes);
			break;
		case 'ceiling1':
			name += ' (Ceiling)';
			break;
		case 'ceiling':
			name += ' (Ceiling color)';
			newTypes = newTypes.concat(hsvTypes);
			break;
		case 'bslamp':
			name += ' (Bedside)';
			newTypes = newTypes.concat(hsvTypes);
			break;
		case 'desklamp':
			name += ' (Desklamp)';
			break;
		default:
			break;
		}

		var newDevice = {
			device : {
				name : yeelight.name || name,
				identifier : yeelight.id,
				protocol : 'wifi',
				service : 'yeelight'
			},
			types : newTypes
		};

		// And add it to Gladys
		return gladys.device.create(newDevice)
			.then(function(device) {
				console.log(`Yeelight - Device ${device.device.identifier} created!`);

				// Create an instance
				shared.instances[device.device.identifier] = yeelight;

				return Promise.resolve();
			})
			.catch(function(err) {
				console.log(`Yeelight - Error, device ${newDevice.device.identifier} not created!`);
				return Promise.reject(err);
			});
	});

	return Promise.resolve();
};