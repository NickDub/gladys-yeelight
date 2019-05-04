const y = require('yeelight-awesome');
const Promise = require('bluebird');
const utils = require('./utils.js');

module.exports = function exec(params) {
	const value = params.state.value;
	const yeelight = new y.Yeelight({ lightIp: params.deviceType.identifier, lightPort: 55443 });

	yeelight.on('connected', () => {
		switch (params.deviceType.type) {
			case 'binary':
				yeelight.setPower(value == 1, 'smooth');
				break;

			case 'brightness':
				yeelight.setBright(value, 'smooth');
				break;

			case 'hue':
				utils.getLastState(params.deviceType.device, 'saturation')
					.then((currentSat) => yeelight.setHSV(value, currentSat, 'smooth'));
				break;

			case 'saturation':
				utils.getLastState(params.deviceType.device, 'hue')
					.then((currentHue) => yeelight.setHSV(currentHue, value, 'smooth'));
				break;

			default:
				yeelight.disconnect();
				return Promise.reject();
		}

		yeelight.on('commandSuccess', (eventData) => {
			sails.log.info(`Yeelight - Device command: ${eventData.action} (${eventData.command.params}) OK`);
			yeelight.disconnect();
			return Promise.resolve();
		});

		yeelight.on('commandError', (eventData) => {
			sails.log.error(`Yeelight - Error, unable to send command: ${eventData.action} (${eventData.result.error.message})`);
			yeelight.disconnect();
			return Promise.reject();
		});
	});

	yeelight.connect();
};
