var Promise = require('bluebird');

module.exports = {
	getCurrentValues : function getCurrentValues(yeelight) {
		return new Promise(function(resolve, reject) {
			yeelight.getValues('power', 'bright', 'hue', 'sat')
				.then(function(req) {
					// Get response and set values
					yeelight.on('response', (id, result) => {
						if (req === id) {
							console.log(`Yeelight - Power: ${result[0]}, Bright: ${result[1]}, Hue: ${result[2]}, Sat: ${result[3]}`);

							return resolve({
								power : result[0] === 'on' ? 1 : 0,
								brightness : result[1],
								hue : result[2],
								saturation : result[3]
							});
						}
					});
				});
		});
	},

	changeState : function changeState(deviceType, value) {
		return new Promise(function(resolve, reject) {
			var newState = {
				devicetype : deviceType.id,
				value : value
			};

			gladys.deviceState.create(newState)
				.then(function(state) {
					console.log(`Yeelight - state ${deviceType.identifier} created`);
					return resolve(state.value);
				})
				.catch((err) => {
					console.log(`Yeelight - Error, state ${deviceType.identifier} not created!`);
					return reject(err);
				});
		});
	},

	getLastState : function getLastState(device, deviceTypeId) {
		return new Promise(function(resolve, reject) {
			gladys.deviceType.getByDevice({ id: device })
				.then(function(deviceTypes) {
					var deviceType = deviceTypes.find(deviceType => deviceType.identifier === deviceTypeId);

					if (deviceType) {
						console.log(`Yeelight - state retrieved`);
						return resolve(deviceType.lastValue);
					} else {
						console.log(`Yeelight - Error, no state retrieved!`);
						return reject();
					}
				});
		});
	}
};