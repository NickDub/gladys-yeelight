var Promise = require('bluebird');
var shared = require('./shared.js');

module.exports = function exec(params) {
	var value = params.state.value;
	var yeelight = shared.instances[params.deviceType.identifier];
	var model = yeelight.getModel();

	switch (params.deviceType.type) {
	case 'binary':
		if (value == 1) {
			return yeelight.turnOn()
				.then(() => {
					return Promise.resolve();
				})
				.catch((err) => {
					return Promise.reject();
				});
		} else {
			return yeelight.turnOff()
				.then(() => {
					return Promise.resolve();
				})
				.catch((err) => {
					return Promise.reject();
				});
		}

	case 'brightness':
		return yeelight.setBrightness(value)
			.then(() => {
				return Promise.resolve();
			})
			.catch((err) => {
				return Promise.reject();
			});

	case 'hue':
		if (model != 'mono') {
			return yeelight.setHSV(value, '')
				.then(() => {
					return Promise.resolve();
				})
				.catch((err) => {
					return Promise.reject();
				});
		} else {
			return Promise.reject();
		}

	case 'saturation':
		if (model != 'mono') {
			return yeelight.setHSV('', value)
				.then(() => {
					return Promise.resolve();
				})
				.catch((err) => {
					return Promise.reject();
				});
		} else {
			return Promise.reject();
		}
	}
};