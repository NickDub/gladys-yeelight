const y = require('yeelight-awesome');
const Promise = require('bluebird');
const shared = require('./shared.js');
const utils = require('./utils.js');

module.exports = function setup() {
	// Reset all instances 
	shared.instances = {};

	// Search all yeelights on the network
	const discover = new y.Discover({ debug: true });

	return discover.start()
		.then(yeelights => {
			discover.destroy();

			return Promise.mapSeries(yeelights, function (yeelight) {
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

					// If model can set hue and saturation
					if (utils.isColor(yeelight)) {
						newTypes = newTypes.concat(hsvTypes);
					}

					const name = shared.models[yeelight.model] ? 'Yeelight' + shared.models[yeelight.model] : 'Yeelight';

					const newDevice = {
						device: {
							name: yeelight.name || name,
							identifier: yeelight.host,
							protocol: 'wifi',
							service: 'yeelight'
						},
						types: newTypes
					};

					// And add it to Gladys
					return gladys.device.create(newDevice)
						.then((device) => {
							sails.log.info(`Yeelight - Device with IP: ${device.device.identifier} created!`);

							// Create an instance
							shared.instances[device.device.identifier] = yeelight;

							return Promise.resolve();
						})
						.catch((err) => {
							sails.log.error(`Yeelight - Error, device with IP: ${newDevice.device.identifier} not created!`);
							return Promise.reject(err);
						});
				});
		});
};