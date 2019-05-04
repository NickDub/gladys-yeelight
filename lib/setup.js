const y = require('yeelight-awesome');
const Promise = require('bluebird');

const models = {
	mono: ' (White)',
	color: ' (RGBW)',
	stripe: ' (Stripe)',
	ceiling1: ' (Ceiling)',
	ceiling: ' (Ceiling color)',
	bslamp1: ' (Bedside)',
	bslamp: ' (Bedside)',
	desklamp: ' (Desklamp)'
};

module.exports = function setup() {
	const discover = new y.Discover({ port: 1982, debug: true });

	discover.on('deviceAdded', (device) => {
		sails.log.info(`Yeelight - Device found IP: ${device.host} (model: ${device.model})`);

		let newTypes = [
			{
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

		if (device.capabilities.includes(y.CommandType.SET_RGB)
			&& device.capabilities.includes(y.CommandType.SET_HSV)) {
			const hsvTypes = [
				{
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

			newTypes = newTypes.concat(hsvTypes);
		}

		const name = models[device.model] ? 'Yeelight' + models[device.model] : 'Yeelight';

		const newDevice = {
			device: {
				name,
				identifier: device.host,
				protocol: 'wifi',
				service: 'yeelight'
			},
			types: newTypes
		};

		gladys.device.create(newDevice)
			.then((device) => sails.log.info(`Yeelight - Device (IP: ${device.device.identifier}) created!`))
			.catch((err) => sails.log.error(`Yeelight - Error, device (IP: ${newDevice.device.identifier}) not created: ${err}`));
	});

	return discover.start()
		.catch((err) => sails.log.error(`Yeelight - Error while discovering: ${err}`))
		.then(() => discover.destroy())
		.then(() => Promise.resolve());
};
