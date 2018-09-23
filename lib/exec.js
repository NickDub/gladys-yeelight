var Promise = require('bluebird');
var shared = require('./shared.js');
var utils = require('./utils.js');

module.exports = function exec(params) {
	var value = params.state.value;
	var yeelight = shared.instances[params.deviceType.identifier];

	if (yeelight) {
		try {
			var model = yeelight.getModel();

			switch (params.deviceType.type) {
			case 'binary':
				if (value == 1) {
					return yeelight.turnOn()
						.then((req) => Promise.resolve())
						.catch((err) => Promise.reject());
				} else {
					return yeelight.turnOff()
						.then((req) => Promise.resolve())
						.catch((err) => Promise.reject());
				}
	
			case 'brightness':
				return yeelight.setBrightness(value)
					.then((req) => Promise.resolve())
					.catch((err) => Promise.reject());
	
			case 'hue':
				if (utils.isColor(yeelight)) {
					return utils.getLastState(params.deviceType.device, 'saturation')
						.then((saturation) => yeelight.setHSV(value, saturation))
						.then((req) => Promise.resolve())
						.catch((err) => Promise.reject());
				} else {
					return Promise.reject();
				}
	
			case 'saturation':
				if (utils.isColor(yeelight)) {
					return utils.getLastState(params.deviceType.device, 'hue')
						.then((hue) => yeelight.setHSV(hue, value))
						.then((req) => Promise.resolve())
						.catch((err) => Promise.reject());
				} else {
					return Promise.reject();
				}
			}
		}
		catch(err) {
			sails.log.error(err);
			return Promise.reject(err);
		}
	} else {
		return Promise.reject();
	}
};