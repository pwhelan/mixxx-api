var calls = [];
var state = {
	'Master':	{},
	'Channel1':	{},
	'Channel2':	{},
	'Channel3':	{},
	'Channel4':	{},
};

exports.setValue = function(group, control, value)
{
	calls.push({type: 'set', group: group, control: control, value: value});
	console.log("[S] GROUP = " + group + " CONTROL = " + control + " VALUE = " + value);
};

exports.getValue = function(group, control)
{
	calls.push({type: 'get', group: group, control: control});
	console.log("[G] GROUP = " + group + " CONTROL = " + control);
	
	return Math.random(1, 1000);
};

exports.connectControl = function(group, control, func)
{
	calls.push({type: 'connect', group: group, control: control, func: func});
	console.log("[C] CONTROL = " + control);
};

exports.getParameter = function(fader, parameter)
{
	calls.push({type: 'getp', fader: fader, parameter: parameter});
	console.log("[GP] FADER = " + fader + " PARAMETER = " + parameter);
};

exports.setParameter = function(fader, parameter, value)
{
	calls.push({type: 'getp', fader: fader, parameter: parameter, value: value});
	console.log("[GP] FADER = " + fader + " PARAMETER = " + parameter + " VALUE = " + value);
};

exports.dumpcalls = function()
{
	var ret = calls;
	calls = [];
	return ret;
};
