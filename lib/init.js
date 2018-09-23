var YeelightSearch = require('yeelight-wifi');
var Promise = require('bluebird');
var shared = require('./shared.js');
var utils = require('./utils.js');

module.exports = function init() {
	// Get all yeelight devices from Gladys
	gladys.device.getByService({service : 'yeelight'})
		.then((devices) => Promise.map(devices, function(device) {
			return {id : device.id, identifier : device.identifier};
		}))
		.then(function(deviceIds) {
			// Reset all instances
			shared.instances = {};

			// Search all yeelight on network
			var yeelightSearch = new YeelightSearch();

			// When found...
			yeelightSearch.on('found', function(yeelight) {
				sails.log.info(`Yeelight - Device found, id: ${yeelight.id}, type: ${yeelight.model}`);

				// Test if Gladys known it...
				var deviceId = deviceIds.filter(deviceId => deviceId.identifier === yeelight.id).pop();
				if (deviceId) {
					sails.log.info(`Yeelight - Device, id: ${deviceId.identifier} exists in Gladys`);

					// and create an instance
					shared.instances[yeelight.id] = yeelight;

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
				} else {
					sails.log.info(`Yeelight - Device unknown in Gladys! Please launch module configuration again.`);
				}
			});
		});
};