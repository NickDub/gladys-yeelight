module.exports = function(sails) {
	var install = require('./lib/install.js');
	var setup = require('./lib/setup.js');
	var init = require('./lib/init.js');
	var exec = require('./lib/exec.js');
	var send = require('./lib/send.js');

	gladys.on('ready', function() {
		init();
	});

	return {
		install : install,
		setup : setup,
		init : init,
		exec : exec,
		send : send
	};

};