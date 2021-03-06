'use strict';
var exec = require('child_process').exec;
var personalData = require('./personalData');
var webModel = require('./webModel');
var webModelFunctions = require('./webModelFunctions');
var working = false;

var checkBattery = function (logIt) {
    if (!working) {
        working = true;
        var batteryCommand = '/usr/bin/upower -d';
        var collectedData = '';
        var batteryCheck = exec(batteryCommand);
        batteryCheck.stdout.on('data', (data) => {
            collectedData += data;
        });
        batteryCheck.on('close', () => {
            let re = /\s+/;
            let output = collectedData.split('\n');
            let percentageFound = false;
            for (let i = 0; i < output.length; i++) {
                if (output[i].indexOf('online') > -1) {
                    let pluggedIn = output[i].split(re)[2];
                    if (pluggedIn.match('no')) {
                        webModelFunctions.update('pluggedIn', false);
                    }
                    if (pluggedIn.match('yes')) {
                        webModelFunctions.update('pluggedIn', true);
                    }
                } else if (!percentageFound && output[i].indexOf('percentage') > -1) {
                    webModelFunctions.update('laptopBatteryPercentage', output[i].split(re)[2].slice(0, -1));
                    percentageFound = true;
                }
            }
            if (webModel.laptopBatteryPercentage >= personalData.batteryConsideredFullAt) {
                webModelFunctions.update('laptopFullyCharged', true);
            } else {
                webModelFunctions.update('laptopFullyCharged', false);
            }
            if (logIt) {
                console.log(webModel.laptopBatteryPercentage, webModel.pluggedIn, webModel.laptopFullyCharged);
            }
            working = false;
        });
    }
};
module.exports = checkBattery;
if (require.main === module) {
    // Run the function if this is called directly instead of required.
    checkBattery(true);
}
