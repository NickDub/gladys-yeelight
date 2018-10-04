var Promise = require('bluebird');
var shared = require('./shared.js');
var utils = require('./utils.js');

module.exports = function exec(params) {
	var value = params.state.value;
	var yeelight = shared.instances[params.deviceType.identifier];

	if (yeelight) {
		try {
			switch (params.deviceType.type) {
			case 'binary':
				return yeelight.set_power(value) // value will be converted to state
						.then((req) => Promise.resolve())
						.catch((err) => Promise.reject());
				
			case 'brightness':
				return yeelight.set_bright(value)
					.then((req) => Promise.resolve())
					.catch((err) => Promise.reject());
	
			case 'hue':
				if (utils.isColor(yeelight)) {
					return utils.getLastState(params.deviceType.device, 'saturation')
						.then((saturation) => yeelight.set_hsv(value, saturation))
						.then((req) => Promise.resolve())
						.catch((err) => Promise.reject());
				} else {
					return Promise.reject();
				}
	
			case 'saturation':
				if (utils.isColor(yeelight)) {
					return utils.getLastState(params.deviceType.device, 'hue')
						.then((hue) => yeelight.set_hsv(hue, value))
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