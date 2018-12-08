const y = require('yeelight-awesome');
const Promise = require('bluebird');
const utils = require('./utils.js');

module.exports = function exec(params) {
	const value = params.state.value;
	const yee = new y.Yeelight({ lightIp: params.deviceType.identifier, lightPort: '55443' });

	yee.connect()
		.then((yeelight) => {
			switch (params.deviceType.type) {
				case 'binary':
					return yeelight.setPower(value == 1, 'smooth')
						.catch((err) => Promise.reject(err));

				case 'brightness':
					return yeelight.setBright(value, 'smooth', 500)
						.catch((err) => Promise.reject(err));

				case 'hue':
					return utils.getLastState(params.deviceType.device, 'saturation')
						.then((currentSat) => {
							return yeelight.setHSV(value, currentSat, 'smooth', 500)
								.catch((err) => Promise.reject(err));
						});

				case 'saturation':
					return utils.getLastState(params.deviceType.device, 'hue')
						.then((currentHue) => {
							return yeelight.setHSV(currentHue, value, 'smooth', 500)
								.catch((err) => Promise.reject(err));
						});

				default:
					return Promise.reject();
			}
		})
		.then((res) => yee.disconnect())
		.catch((err) => Promise.reject(err));
};