module.exports = function() {
	const type = {
		name : 'Yeelight',
		service : 'yeelight'
	};

	return gladys.notification.install(type);
};