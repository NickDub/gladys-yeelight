var Promise = require('bluebird');
var shared = require('./shared.js');
var utils = require('./utils.js');

module.exports = function send(params) {
	var yeelight = shared.instances[params.identifier];

	if (yeelight.supports.indexOf(params.method) >= 0) {
		try {
			// Sending command
			return yeelight.command(params.method, params.params)
				// Get device to update states
				.then((req) => {
					var options = {
						identifier : params.identifier,
						service : 'yeelight'
					};
					return gladys.device.getByIdentifier(options);
				})
				.then((device) => {
					// Get current values and Gladys deviceTypes
					var options = {
						id : device.id
					};
					Promise.join(utils.getCurrentValues(yeelight),
						gladys.deviceType.getByDevice(options),
						function(values, deviceTypes) {
							Promise.map(deviceTypes, function(deviceType) {
								return utils.changeState(deviceType, values[deviceType.identifier]);
							});
						});
				})
				.catch((err) => Promise.reject(err));
		} catch(err) {
			sails.log.error(err);
			return Promise.reject(err);
		}
	} else {
		return Promise.reject();
	}
};