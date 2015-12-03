var calls = [];

console.log("LOADING FAKE MIDI");

exports.sendShortMsg = function(control,status,value)
{
	console.log("[M] CONTROL = " + control + " STATUS = " + status + " VALUE = " + value);
};

exports.sendSysexMsg = function(data, len)
{
	console.log("[SYSEX] LEN = " + len + " DATA = " + data);
	return Math.random(1, 1000);
};
