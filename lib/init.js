var Promise = require('bluebird');
var YeelightSearch = require('yeelight-wifi');
var shared = require('./shared.js');

module.exports = function init() {

	// reset all instances 
	shared.instances = {};

	var yeelightSearch = new YeelightSearch();

	yeelightSearch.on('found', (lightBulb) => {
		shared.instances[lightBulb.id] = lightBulb;
	});
};