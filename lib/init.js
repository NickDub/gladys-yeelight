const y = require('yeelight-awesome');
const Promise = require('bluebird');
const utils = require('./utils.js');

module.exports = function init() {
	gladys.device.getByService({ service: 'yeelight' })
		.then((devices) => {
			Promise.map(devices, (device) => {
				const yee = new y.Yeelight({ lightIp: device.identifier, lightPort: 55443 });

				yee.connect()
					.then((yeelight) => {
						Promise.join(
							utils.getCurrentValues(yeelight),
							gladys.deviceType.getByDevice({ id: device.id }),
							(values, deviceTypes) => {
								Promise.map(deviceTypes, (deviceType) => utils.changeState(deviceType, values[deviceType.identifier]))
									.then(() => sails.log.info(`Yeelight - Device IP: ${device.identifier} initialized`));
							});
					})
					.then(() => yee.disconnect());
				});
		});
};