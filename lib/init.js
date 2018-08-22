var Promise = require('bluebird');
var YeelightSearch = require('yeelight-wifi');
var shared = require('./shared.js');

module.exports = function init() {

	// reset all instances 
	shared.instances = {};

	var yeelightSearch = new YeelightSearch();

	yeelightSearch.on('found', function(lightBulb) {
		console.log(`Yeelight - Device : ${lightBulb.id} (${lightBulb.model}) initialized`);
		shared.instances[lightBulb.id] = lightBulb;
	});
};