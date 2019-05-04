const y = require('yeelight-awesome');
const utils = require('./utils.js');

module.exports = function init() {
	gladys.device.getByService({ service: 'yeelight' })
		.then((devices) => devices.map((device) => {
			const yeelight = new y.Yeelight({ lightIp: device.identifier, lightPort: 55443 });

			yeelight.on('connected', async () => {
				const values = await utils.getYeelightValues(yeelight);
				gladys.deviceType.getByDevice({ id: device.id })
					.map((deviceType) => utils.changeState(deviceType, values[deviceType.identifier]))
					.then(() => {
						sails.log.info(`Yeelight - Device IP: ${device.identifier} initialized`);
						yeelight.disconnect();
					});

				yeelight.on('commandError', (eventData) => {
					sails.log.error(`Yeelight - Error, unable to send command: ${eventData.action} (${eventData.result.error.message})`);
					yeelight.disconnect();
				});
			});

			yeelight.connect();
		}));
};