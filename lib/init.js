const y = require('yeelight-awesome');
const Promise = require('bluebird');
const utils = require('./utils.js');

module.exports = function init() {
	gladys.device.getByService({ service: 'yeelight' })
		.then((devices) => {
			Promise.mapSeries(devices, (device) => {
				const yee = new y.Yeelight({ lightIp: device.identifier, lightPort: 55443 });

				yee.connect()
					.then((yeelight) => {
						return Promise.join(
							utils.getCurrentValues(yeelight),
							gladys.deviceType.getByDevice({ id: device.id }),
							(values, deviceTypes) => deviceTypes.map((deviceType) => utils.changeState(deviceType, values[deviceType.identifier]))
						)
						.then((res) => sails.log.info(`Yeelight - Device IP: ${device.identifier} initialized`));
					})
					.then(() => yee.disconnect())
					.catch((err) => Promise.reject(err));
				});
		});
};