var Promise = require('bluebird');
var shared = require('./shared.js');
var utils = require('./utils.js');

module.exports = function send(params) {
	var yeelight = shared.instances[params.identifier];

	// Send command
	yeelight.sendRequest(params.method, params.params)
		.then((req) => {
			// Get current values
			utils.getCurrentValues(yeelight)
				.then((values) => {
					// Get device
					var options = {
						identifier : params.identifier,
						service : 'yeelight'
					}
					gladys.device.getByIdentifier(options)
						.then(function(device) {
							// Set deviceTypes values
							gladys.deviceType.getByDevice({id : device.id})
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
				});

			return Promise.resolve();
		})
		.catch(function(err) {
			return Promise.reject(err);
		});
};