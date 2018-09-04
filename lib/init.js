var YeelightSearch = require('yeelight-wifi');
var Promise = require('bluebird');
var shared = require('./shared.js');
var utils = require('./utils.js');

module.exports = function init() {
	// Get all yeelight devices from Gladys
	gladys.device.getByService({service : 'yeelight'})
		.then(function(devices) {
			return Promise.resolve(devices.map(device => {
				return {id : device.id, identifier : device.identifier};
			}));
		})
		.then(function(deviceIds) {
			// Reset all instances 
			shared.instances = {};

			// Search all yeelight
			var yeelightSearch = new YeelightSearch();

			// When found...
			yeelightSearch.on('found', function(yeelight) {
				console.log(`Yeelight - Device found, id: ${yeelight.id}, type: ${yeelight.model}`);

				// Create an instance
				shared.instances[yeelight.id] = yeelight;

				// And test if Gladys known it
				var deviceId = deviceIds.filter(deviceId => deviceId.identifier === yeelight.id);
				if (deviceId) {
					console.log(`Yeelight - Device, id: ${deviceId[0].identifier} exists in Gladys`);

					// Get current values
					utils.getCurrentValues(yeelight)
						.then((values) => {
							// Set deviceTypes current values
							gladys.deviceType.getByDevice({id : deviceId[0].id})
								.then(function(deviceType) {
									deviceType.forEach(function(deviceType) {
										switch (deviceType.identifier) {
										case 'power':
										case 'brightness':
										case 'hue':
										case 'saturation':
											utils.changeState(deviceType, values[deviceType.identifier]);
											break;

										default:
											break;
										}
									});
								});
						});
					console.log(`Yeelight - Device: ${yeelight.id} (${yeelight.model}) initialized`);
				} else {
					console.log(`Yeelight - Device unknown! Please launch module configuration again.`);
				}
			});
		});
};