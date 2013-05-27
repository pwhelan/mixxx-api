/*
 * Emulates the Mixxx Scripting Engine, useful for testing...
 */

var 	engine = require('./engine'),
	fs = require('fs'),
	xmlParseString = require('xml2js').parseString,
	vm = require('vm');

var print = function(str)
{
	engine.log(str);
}


if (process.argv.length < 3) {
	console.log('usage: ' + process.argv[0] + ' <XML File>');
	process.exit(-1);
}


var xml = fs.readFileSync(process.argv[2]);
xmlParseString(xml, function(err, result) {
	var preset = result.MixxxMIDIPreset;
	var scripts = preset.controller[0].scriptfiles;
	var sandbox = vm.createContext({engine:engine});
	
	for (var i = 0; i < scripts[0].file.length; i++) {
		var script = scripts[0].file[i];
		var code = fs.readFileSync(script.$.filename);
		
		vm.runInContext(code, sandbox);
	}
});
