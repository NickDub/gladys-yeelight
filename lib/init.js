const y = require('yeelight-awesome');
const Promise = require('bluebird');
const shared = require('./shared.js');
const utils = require('./utils.js');

module.exports = function init() {
	// Reset all instances
	shared.instances = {};

	// Get all yeelight devices from Gladys
	gladys.device.getByService({ service: 'yeelight' })
		.then((devices) => {
			Promise.map(devices, function (device) {
				// and create an instance
				let yeelight = new y.Yeelight({ lightIp: device.identifier, lightPort: 55443 });

				yeelight.connect()
					.then((light) => {
						shared.instances[device.identifier] = light;

						// Get current values and Gladys deviceTypes
						Promise.join(utils.getCurrentValues(light), gladys.deviceType.getByDevice({ id: device.id }),
							function (values, deviceTypes) {
								Promise.map(deviceTypes, function (deviceType) {
										return utils.changeState(deviceType, values[deviceType.identifier]);
									})
									.then(() => sails.log.info(`Yeelight - Device IP: ${device.identifier} initialized`));
							});
					});
			});
		});
};