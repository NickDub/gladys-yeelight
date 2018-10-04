var Yeelight = require('yeelight2');
var Promise = require('bluebird');
var shared = require('./shared.js');
var utils = require('./utils.js');

module.exports = function init() {
	// Reset all instances
	shared.instances = {};

	// Get all yeelight devices from Gladys
	gladys.device.getByService({service : 'yeelight'})
		.then((devices) => Promise.map(devices, function(device) {
			var yeelight = new Yeelight(device.identifier);

			// Create an instance
			shared.instances[device.identifier] = yeelight;

			// Get current values and Gladys deviceTypes
			var options = {
				id : deviceId.id
			};
			Promise.join(utils.getCurrentValues(yeelight),
				gladys.deviceType.getByDevice(options),
				function(values, deviceTypes) {
					Promise.map(deviceTypes, function(deviceType) {
						return utils.changeState(deviceType, values[deviceType.identifier]);
					})
					.then(() => sails.log.info(`Yeelight - Device: ${yeelight.id} (${yeelight.model}) initialized`));
				});
		}));
};