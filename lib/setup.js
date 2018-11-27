const y = require('yeelight-awesome');
const Promise = require('bluebird');
const utils = require('./utils.js');

const models = {
	mono : ' (White)',
	color : ' (RGBW)',
	stripe : ' (Stripe)',
	ceiling1 : ' (Ceiling)',
	ceiling : ' (Ceiling color)',
	bslamp1 : ' (Bedside)',
	bslamp : ' (Bedside)',
	desklamp : ' (Desklamp)'
};

module.exports = function setup() {
	const discover = new y.Discover({ debug: true });

	return discover.start()
		.then(yeelights => {
			discover.destroy();

			return Promise.mapSeries(yeelights, (yeelight) => {
					sails.log.info(`Yeelight - Device found, IP: ${yeelight.host}, type: ${yeelight.model}`);

					let newTypes = [{
							name: 'Power',
							type: 'binary',
							category: 'light',
							identifier: 'power',
							sensor: false,
							min: 0,
							max: 1
						},
						{
							name: 'Brightness',
							type: 'brightness',
							category: 'light',
							identifier: 'brightness',
							sensor: false,
							min: 1,
							max: 100
						}
					];

					const hsvTypes = [{
							name: 'Hue',
							type: 'hue',
							category: 'light',
							identifier: 'hue',
							sensor: false,
							min: 1,
							max: 359
						},
						{
							name: 'Saturation',
							type: 'saturation',
							category: 'light',
							identifier: 'saturation',
							sensor: false,
							min: 1,
							max: 100
						}
					];

					if (utils.isColor(yeelight)) {
						newTypes = newTypes.concat(hsvTypes);
					}

					const name = models[yeelight.model] ? 'Yeelight' + models[yeelight.model] : 'Yeelight';

					const newDevice = {
						device: {
							name: yeelight.name || name,
							identifier: yeelight.host,
							protocol: 'wifi',
							service: 'yeelight'
						},
						types: newTypes
					};

					return gladys.device.create(newDevice)
						.then((device) => {
							sails.log.info(`Yeelight - Device with IP: ${device.device.identifier} created!`);
							return Promise.resolve();
						})
						.catch((err) => {
							sails.log.error(`Yeelight - Error, device with IP: ${newDevice.device.identifier} not created!`);
							return Promise.reject(err);
						});
				});
		});
};