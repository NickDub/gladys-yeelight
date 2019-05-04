const y = require('yeelight-awesome');
const Promise = require('bluebird');

module.exports = {
	getYeelightValues: (yeelight) => {
		return yeelight.getProperty([y.DevicePropery.POWER, y.DevicePropery.BRIGHT, y.DevicePropery.HUE, y.DevicePropery.SAT])
			.then((response) => {
				if (response.success) {
					const result = response.result.result;
					// sails.log.debug(`Yeelight - Power: ${result[0]}, Bright: ${result[1]}, Hue: ${result[2]}, Sat: ${result[3]}`);

					return Promise.resolve({
						power: result[0] === 'on' ? 1 : 0,
						brightness: result[1],
						hue: result[2],
						saturation: result[3]
					});
				}
				return Promise.reject();
			})
			.catch((err) => {
				sails.log.error(`Yeelight - Error, unable to get currents properties!`);
				return Promise.reject(err);
			});
	},

	changeState: (deviceType, value) =>{
		return new Promise((resolve, reject) => {
			const newState = { devicetype: deviceType.id, value: value };

			return gladys.deviceState.create(newState)
				.then((state) => {
					// sails.log.debug(`Yeelight - state ${deviceType.identifier} created`);
					return resolve(state.value);
				})
				.catch((err) => {
					sails.log.error(`Yeelight - Error, state ${deviceType.identifier} not created!`);
					return reject(err);
				});
		});
	},

	getLastState: (device, deviceTypeId) =>{
		return new Promise((resolve, reject) => {
			return gladys.deviceType.getByDevice({ id: device })
				.then((deviceTypes) => {
					const deviceType = deviceTypes.find(deviceType => deviceType.identifier === deviceTypeId);

					if (deviceType) {
						// sails.log.debug(`Yeelight - State retrieved`);
						return resolve(deviceType.lastValue);
					} else {
						sails.log.error(`Yeelight - Error, no state retrieved!`);
						return reject();
					}
				});
		});
	}
};
