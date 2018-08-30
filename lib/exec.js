var Promise = require('bluebird');
var shared = require('./shared.js');
var utils = require('./utils.js');

module.exports = function exec(params) {
	var value = params.state.value;
	var yeelight = shared.instances[params.deviceType.identifier];
	var model = yeelight.getModel();

	switch (params.deviceType.type) {
	case 'binary':
		if (value == 1) {
			return yeelight.turnOn()
				.then((req) => {
					return Promise.resolve();
				})
				.catch((err) => {
					return Promise.reject();
				});
		} else {
			return yeelight.turnOff()
				.then((req) => {
					return Promise.resolve();
				})
				.catch((err) => {
					return Promise.reject();
				});
		}

	case 'brightness':
		return yeelight.setBrightness(value)
			.then((req) => {
				return Promise.resolve();
			})
			.catch((err) => {
				return Promise.reject();
			});

	case 'hue':
		if (!shared.mono.contains(model)) {
			return yeelight.setHSV(value, '')
				.then((req) => {
					return Promise.resolve();
				})
				.catch((err) => {
					return Promise.reject();
				});
		} else {
			return Promise.reject();
		}

	case 'saturation':
		if (!shared.mono.contains(model)) {
			return yeelight.setHSV('', value)
				.then((req) => {
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