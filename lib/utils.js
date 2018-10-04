var Promise = require('bluebird');

module.exports = {
	isColor : function isColor(yeelight) {
		return yeelight.supports.indexOf("set_rgb") >= 0 && yeelight.supports.indexOf("set_hsv") >= 0;
	},

	getCurrentValues : function getCurrentValues(yeelight) {
		return new Promise(function(resolve, reject) {
			var params = ['power', 'bright'];
			if(this.isColor(yeelight)) {
				params = params.concat(['hue', 'sat']);
			}

			return yeelight.get_prop(params)
				.then(function(states) {
					sails.log.debug(`Yeelight - Values: ${JSON.stringify(states)}`);
					return resolve({
						power:states.power,
						brightness:states.bright,
						hue = states.hue ? states.hue : undefined,
						saturation = states.sat ? states.sat : undefined
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
					sails.log.debug(`Yeelight - state ${deviceType.identifier} created`);
					return resolve(state.value);
				})
				.catch((err) => {
					sails.log.error(`Yeelight - Error, state ${deviceType.identifier} not created!`);
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
						sails.log.debug(`Yeelight - State retrieved`);
						return resolve(deviceType.lastValue);
					} else {
						sails.log.error(`Yeelight - Error, no state retrieved!`);
						return reject();
					}
				});
		});
	}
};