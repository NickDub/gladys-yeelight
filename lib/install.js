module.exports = function() {
	var type = {
		name : 'Yeelight',
		service : 'yeelight'
	};

	return gladys.notification.install(type);
};