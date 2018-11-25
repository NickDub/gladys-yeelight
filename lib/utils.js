const y = require('yeelight-awesome');
const Promise = require('bluebird');

module.exports = {
	isColor : function isColor(yeelight) {
		return yeelight.capabilities.includes('set_rgb') && yeelight.capabilities.includes('set_hsv');
	},

	getCurrentValues: function getCurrentValues(yeelight) {
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

	changeState : function changeState(deviceType, value) {
		return new Promise(function(resolve, reject) {
			const newState = {
				devicetype : deviceType.id,
				value : value
			};

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

	getLastState : function getLastState(device, deviceTypeId) {
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

	getCommand: function getCommand(params) {
		let commandType;
		switch (params.method) {
			case 'set_power':
				commandType = y.CommandType.SET_POWER;
				break;
			case 'toggle':
				commandType = y.CommandType.TOGGLE;
				break;
			case 'set_default':
				commandType = y.CommandType.SET_DEFAULT;
				break;
			case 'start_cf':
				commandType = y.CommandType.START_COLOR_FLOW;
				break;
			case 'stop_cf':
				commandType = y.CommandType.STOP_COLOR_FLOW;
				break;
			case 'get_prop':
				commandType = y.CommandType.GET_PROPS;
				break;
			case 'set_scene':
				commandType = y.CommandType.SET_SCENE;
				break;
			case 'set_ct_abx':
				commandType = y.CommandType.SET_CT_ABX;
				break;
			case 'set_rgb':
				commandType = y.CommandType.SET_RGB;
				break;
			case 'set_hsv':
				commandType = y.CommandType.SET_HSV;
				break;
			case 'set_bright':
				commandType = y.CommandType.SET_BRIGHT;
				break;
			case 'cron_add':
				commandType = y.CommandType.CRON_ADD;
				break;
			case 'cron_get':
				commandType = y.CommandType.CRON_GET;
				break;
			case 'cron_del':
				commandType = y.CommandType.CRON_DEL;
				break;
			case 'set_adjust':
				commandType = y.CommandType.SET_ADJUST;
				break;
			case 'set_music':
				commandType = y.CommandType.SET_MUSIC;
				break;
			case 'set_name':
				commandType = y.CommandType.SET_NAME;
				break;
			case 'adjust_bright':
				commandType = y.CommandType.ADJUST_BRIGHT;
				break;
			case 'adjust_ct':
				commandType = y.CommandType.ADJUST_CT;
				break;
			case 'adjust_color':
				commandType = y.CommandType.ADJUST_COLOR;
				break;
			default:
				break;
		}

		return new y.Command(1, commandType, params.params)
	}
};