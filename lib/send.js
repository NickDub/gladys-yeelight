const y = require('yeelight-awesome');
const Promise = require('bluebird');
const utils = require('./utils.js');

module.exports = function send(params) {
	if (yeelight.capabilities.includes(params.method)) {
		const yee = new y.Yeelight({ lightIp: params.identifier, lightPort: '55443' });

		yee.connect()
			.then((yeelight) => yeelight.sendCommand(utils.getCommand(params))
				.then(() => gladys.device.getByIdentifier({ identifier: params.identifier, service: 'yeelight' }))
				.then((device) => Promise.join(utils.getCurrentValues(yeelight), gladys.deviceType.getByDevice({ id: device.id }),
					(values, deviceTypes) => Promise.map(deviceTypes,
						(deviceType) => utils.changeState(deviceType, values[deviceType.identifier]))))
				.catch((err) => {
					sails.log.error(`Yeelight - Error, unable to send command!`);
					Promise.reject(err);
				})
			)
			.then((res) => yee.disconnect())
			.catch((err) => Promise.reject(err));
	} else {
		return Promise.reject();
	}
};