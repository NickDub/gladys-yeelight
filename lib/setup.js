var Yeelight = require('yeelight2');
var Promise = require('bluebird');
var shared = require('./shared.js');
var utils = require('./utils.js');

module.exports = function setup() {
	// Reset all instances 
	shared.instances = {};

	// Search all yeelight on network
	Yeelight.discover(function(yeelight) {
		sails.log.info(`Yeelight - Device found: ${yeelight} - ${JSON.stringify(yeelight)}`);

		var newTypes = [
			{
				name : 'Power',
				type : 'binary',
				category: 'light',
				identifier : 'power',
				sensor : false,
				min : 0,
				max : 1
			},
			{
				name : 'Brightness',
				type : 'brightness',
				category: 'light',
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
				category: 'light',
				identifier : 'hue',
				sensor : false,
				min : 1,
				max : 359
			},
			{
				name : 'Saturation',
				type : 'saturation',
				category: 'light',
				identifier : 'saturation',
				sensor : false,
				min : 1,
				max : 100
			}
		];

		// If model can set hue and saturation
		if (utils.isColor(yeelight)) {
			newTypes = newTypes.concat(hsvTypes);
		}

		var name = shared.models[yeelight.model] ? 'Yeelight' + shared.models[yeelight.model] : 'Yeelight';

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
				sails.log.info(`Yeelight - Device ${device.device.identifier} created!`);

				// Create an instance
				shared.instances[device.device.identifier] = yeelight;

				return Promise.resolve();
			})
			.catch(function(err) {
				sails.log.error(`Yeelight - Error, device ${newDevice.device.identifier} not created!`);
				return Promise.reject(err);
			});
	});

	return Promise.resolve();
};