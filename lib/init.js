var YeelightSearch = require('yeelight-wifi');
var Promise = require('bluebird');
var shared = require('./shared.js');
var utils = require('./utils.js');

module.exports = function init() {

	gladys.device.getByService({
		service : 'yeelight'
	})
		.then(function(devices) {
			//return Promise.resolve(devices.map(device => device.identifier));
			return Promise.resolve(devices.map(device => {
				return {id: device.id, identifier: device.identifier};
				}));
		})
		.then(function(deviceIds) {
			// Reset all instances 
			shared.instances = {};

			var yeelightSearch = new YeelightSearch();

			yeelightSearch.on('found', function(yeelight) {
				var deviceId = deviceIds.filter(deviceId => deviceId.identifier === yeelight.id);
				if (deviceId) {
					shared.instances[yeelight.id] = yeelight;

					// Get current values
					utils.getCurrentValues(yeelight)
						.then((values) => {
							// Set deviceTypes values
							gladys.deviceType.getByDevice({id: deviceId[0].id})
								.then(function(deviceType){
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

					console.log(`Yeelight - Device : ${yeelight.id} (${yeelight.model}) initialized`);
				} else {
					console.log(`Yeelight - Device unknown! Please make module configuration again.`);
				}
			});
		});
};