var Promise = require('bluebird');
var YeelightSearch = require('yeelight-wifi');
var init = require('./init.js');

module.exports = function setup() {

	var yeelightSearch = new YeelightSearch();

	yeelightSearch.on('found', function(lightBulb) {
		console.log(`Yeelight - Device found: ${lightBulb.id} (${lightBulb.model})`);

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

		switch (lightBulb.model) {
		case 'mono':
			var name = 'Yeelight';
			break;

		case 'color':
			name = 'Yeelight (RGBW)';
			newTypes = newTypes.concat(hsvTypes);
			break;

		case 'stripe':
			var name = 'Yeelight (Stripe)';
			newTypes = newTypes.concat(hsvTypes);
			break;

		case 'ceiling':
			var name = 'Yeelight (Ceiling)';
			newTypes = newTypes.concat(hsvTypes);
			break;

		case 'bslamp':
			var name = 'Yeelight (Bedside)';
			newTypes = newTypes.concat(hsvTypes);
			break;

		default:
			break;
		}

		var newDevice = {
			device : {
				name : lightBulb.name || name,
				identifier : lightBulb.id,
				protocol : 'wifi',
				service : 'yeelight2'
			},
			types : newTypes
		};

		return gladys.device.create(newDevice)
			.then(function(device) {
				console.log(`Yeelight - Device ${device.identifier} created!`);
				return Promise.resolve();
			})
			.then(() => init())
			.catch(function(err) {
				console.log(`Yeelight - Error, device ${newDevice.identifier} not created!`);
				return Promise.reject(err);
			});
	});
};