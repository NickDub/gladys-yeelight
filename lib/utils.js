const y = require('yeelight-awesome');
const Promise = require('bluebird');

module.exports = {
	availableCommands: {
		'set_power': y.CommandType.SET_POWER,
		'toggle': y.CommandType.TOGGLE,
		'set_default': y.CommandType.SET_DEFAULT,
		'start_cf': y.CommandType.START_COLOR_FLOW,
		'stop_cf': y.CommandType.STOP_COLOR_FLOW,
		'get_prop': y.CommandType.GET_PROPS,
		'set_scene': y.CommandType.SET_SCENE,
		'set_ct_abx': y.CommandType.SET_CT_ABX,
		'set_rgb': y.CommandType.SET_RGB,
		'set_hsv': y.CommandType.SET_HSV,
		'set_bright': y.CommandType.SET_BRIGHT,
		'cron_add': y.CommandType.CRON_ADD,
		'cron_get': y.CommandType.CRON_GET,
		'cron_del': y.CommandType.CRON_DEL,
		'set_adjust': y.CommandType.SET_ADJUST,
		'set_music': y.CommandType.SET_MUSIC,
		'set_name': y.CommandType.SET_NAME,
		'adjust_bright': y.CommandType.ADJUST_BRIGHT,
		'adjust_ct': y.CommandType.ADJUST_CT,
		'adjust_color': y.CommandType.ADJUST_COLOR,
	},

	getCurrentValues: function (yeelight) {
		return yeelight.getProperty([y.DevicePropery.POWER, y.DevicePropery.BRIGHT, y.DevicePropery.HUE, y.DevicePropery.SAT])
			.then((response) => {
				if (response.success) {
					const result = response.result.result;
					sails.log.debug(`Yeelight - Power: ${result[0]}, Bright: ${result[1]}, Hue: ${result[2]}, Sat: ${result[3]}`);

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

	changeState: function (deviceType, value) {
		return new Promise(function(resolve, reject) {
			const newState = { devicetype : deviceType.id, value : value };

			return gladys.deviceState.create(newState)
				.then((state) => {
					sails.log.debug(`Yeelight - state ${deviceType.identifier} created`);
					return resolve(state.value);
				})
				.catch((err) => {
					sails.log.error(`Yeelight - Error, state ${deviceType.identifier} not created!`);
					return reject(err);
				});
		});
	},

	getLastState: function (device, deviceTypeId) {
		return new Promise(function(resolve, reject) {
			return gladys.deviceType.getByDevice({ id: device })
				.then((deviceTypes) => {
					const deviceType = deviceTypes.find(deviceType => deviceType.identifier === deviceTypeId);

					if (deviceType) {
						sails.log.debug(`Yeelight - State retrieved`);
						return resolve(deviceType.lastValue);
					} else {
						sails.log.error(`Yeelight - Error, no state retrieved!`);
						return reject();
					}
				});
		});
	},

	getCommand: function (params) {
		const commandType = availableCommands[params.method];

		return new y.Command(1, commandType, params.params)
	}
};