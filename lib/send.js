const y = require('yeelight-awesome');
const Promise = require('bluebird');
const utils = require('./utils.js');

module.exports = function send(params) {
	const yee = new y.Yeelight({ lightIp: params.identifier, lightPort: 55443 });

	return yee.connect()
		.then((yeelight) => yeelight.sendCommand(utils.getCommand(params)))
		.then((result) => gladys.device.getByIdentifier({ identifier: params.identifier, service: 'yeelight' }))
		.then((device) => Promise.join(utils.getCurrentValues(yeelight), gladys.deviceType.getByDevice({ id: device.id }),
			(values, deviceTypes) => Promise.map(deviceTypes, (deviceType) => utils.changeState(deviceType, values[deviceType.identifier])))
			.catch((err) => {
				sails.log.error(`Yeelight - Error, unable to send command: ${err}`);
				yee.disconnect()
				return Promise.reject(err);
			})
		)
		.then(() => yee.disconnect())
		.catch((err) => {
			sails.log.error(`Yeelight - Error, during send: ${err}`);
			return Promise.reject(err);
		});
};