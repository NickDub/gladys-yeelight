const Promise = require('bluebird');
const shared = require('./shared.js');
const utils = require('./utils.js');

module.exports = function send(params) {
	const yeelight = shared.instances[params.identifier];

	if (yeelight.capabilities.includes(params.method)) {
			// Sending command
			return yeelight.sendCommand(utils.getCommand(params))
				.then(() => gladys.device.getByIdentifier({ identifier : params.identifier, service : 'yeelight' }))
				.then((device) => {
					// Get current values and Gladys deviceTypes
					return Promise.join(utils.getCurrentValues(yeelight), gladys.deviceType.getByDevice({ id : device.id }),
						function(values, deviceTypes) {
							return Promise.map(deviceTypes, function(deviceType) {
								return utils.changeState(deviceType, values[deviceType.identifier]);
							});
						});
				})
				.catch((err) => {
					sails.log.error(`Yeelight - Error, unable to send command!`);
					Promise.reject(err);
				});
	} else {
		return Promise.reject();
	}
};