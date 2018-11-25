const Promise = require('bluebird');
const shared = require('./shared.js');
const utils = require('./utils.js');

module.exports = function exec(params) {
	const value = params.state.value;
	const yeelight = shared.instances[params.deviceType.identifier];

	if (yeelight) {
		switch (params.deviceType.type) {
			case 'binary':
				return yeelight.setPower(value == 1, 'smooth')
					.catch((err) => Promise.reject(err));

			case 'brightness':
				return yeelight.setBright(value, 'smooth')
					.catch((err) => Promise.reject(err));

			case 'hue':
				if (utils.isColor(yeelight)) {
					return utils.getLastState(params.deviceType.device, 'saturation')
						.then((currentSat) => {
							return yeelight.setHSV(value, currentSat, 'smooth')
								.catch((err) => Promise.reject(err));
						});
				} else {
					return Promise.reject();
				}

			case 'saturation':
				if (utils.isColor(yeelight)) {
					return utils.getLastState(params.deviceType.device, 'hue')
						.then((currentHue) => {
							return yeelight.setHSV(currentHue, value, 'smooth')
								.catch((err) => Promise.reject(err));
						});
				} else {
					return Promise.reject();
				}
		}
	} else {
		return Promise.reject();
	}
};