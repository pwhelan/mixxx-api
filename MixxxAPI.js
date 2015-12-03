if (typeof exports != 'undefined')
{
	var engine = require('./test/engine');
	var midi = require('./test/midi-noop');
}

function MixxxEngineCall(group, control, value, noget)
{
	if ( typeof value != 'undefined' )
	{
		engine.setValue(group, control, value);
	}
	
	if (typeof noget != 'undefined' && noget)
	{
		return;
	}
	
	return engine.getValue(group, control);
}

function Hotcue(deck, number)
{
	this.hotcue = number;
	this.deck = deck;
	this.commands = {
		set: null,
		activate: null,
		clear: null,
		enabled: null,
		goto: null,
		gotoandstop: null,
		position: null
	};
	
	
	for (var cmd in this.commands)
	{
		this.commands[cmd] = 'hotcue_' + this.hotcue + '_' + cmd;
	}
	
	
	this.__engineCall = function(control, value)
	{
		return this.deck.__engineCall(control, value);
	};
	
	this.__hotcueCommand = function(command, value)
	{
		return this.__engineCall(this.commands[command], value);
	};
	
	this.Activate = function()
	{
		this.__hotcueCommand('activate', 1);
		return this;
	};
	
	this.Clear = function()
	{
		this.__hotcueCommand('clear', 1);
		return this;
	};
	
	this.Enabled = function()
	{
		return this.__hotcueCommand('enabled');
	};
	
	this.Goto = function()
	{
		this.__hotcueCommand('goto', 1);
		return this;
	};
	
	this.GotoAndStop = function()
	{
		this.__hotcueCommand('gotoandstop', 1);
		return this;
	};
	
	this.Position = function()
	{
		return this.__hotcueCommand('position');
	};
	
	this.Set = function()
	{
		this.__hotcueCommand('set', 1);
		return this;
	};
		
}

function MIDI()
{
	this.Send = function(control,status,value)
	{
		midi.sendShortMsg(control,status,value);
		return this;
	};
	
	this.SendSysex = function(len, data)
	{
		if ( typeof data == 'undefined' )
		{
			data = len;
			len = data.length;
		}
		
		midi.sendSysexMsg(data, len);
		return this;
	};	
}

function Filter(deck, level)
{
	this.deck = deck;
	this.level = level;
	
	this.Set = function(value)
	{
		this.deck.__engineCall('filter' + this.level, value, true);
	};
	
	this.Get = function(value)
	{
		return this.deck.__engineCall('filter' + this.level);
	};
	
	this.Kill = function(value)
	{
		this.deck.__engineCall('filter' + this.level + 'Kill', 1);
	};
	
	this.Killed = function(value)
	{
		return this.deck.__engineCall('filter' + this.level + 'Kill');
	};
}

function Equalizer(deck)
{
	this.filters = {
		low: new Filter(deck, 'Low'),
		mid: new Filter(deck, 'Mid'),
		hi: new Filter(deck, 'High')
	};
	
	this.Low = function()
	{
		return this.filters.low;
	};
	
	this.Mid = function()
	{
		return this.filters.mid;
	};
	
	this.High = function()
	{
		return this.filters.hi;
	};
	
	// A simple Alias
	this.Hi = function()
	{
		return this.filter.hi;
	};
}

function Rate(deck)
{
	this.deck = deck;
	
	this.__engineCall = function(control, value)
	{
		return this.deck.__engineCall(control, value);
	};
	
	this.PermUp = function()
	{
		this.__engineCall('rate_perm_up', 1);
		return this;
	};
	
	this.PermDown = function()
	{
		this.__engineCall('rate_perm_down', 1);
		return this;
	};
	
	this.PermUpSmall = function()
	{
		this.__engineCall('rate_perm_up_small', 1);
		return this;
	};
	
	this.PermDownSmall = function()
	{
		this.__engineCall('rate_perm_down_small', 1);
		return this;
	};
	
	this.TempUp = function()
	{
		this.__engineCall('rate_temp_up', 1);
		return this;
	};
	
	this.TempDown = function()
	{
		this.__engineCall('rate_temp_down', 1);
		return this;
	};
	
	this.ShiftUp = function(value)
	{
		this.__engineCall('rate', this.__engineCall('rate') + value);
		return this;
	};
	
	this.ShiftDown = function(value)
	{
		return this.ShiftUp(-value);
	};
	
}


function Deck(decknum)
{
	this.deck = decknum;
	this.group = '[Channel' + this.deck + ']';
	this.hotcues = [];
	this.eq = new Equalizer(this);
	this.rate = new Rate(this);
	
	
	for (var i = 0; i < 32; i++)
	{
		this.hotcues.push(new Hotcue(this, i));
	}
	
	this.__engineCall = function(control, value)
	{
		return MixxxEngineCall(this.group, control, value);
	};
	
	this.Cue = function(value)
	{
		return this.__engineCall('cue_default', value);
	};
	
	this.Bpm = function(value)
	{
		return this.__engineCall('bpm', value);
	};
	
	this.Beatsync = function(value)
	{
		return this.__engineCall('beatsync', value);
	};
	
	this.End = function(value)
	{
		return this.__engineCall('end', value);
	};
	
	this.Forward = function(value)
	{
		return this.__engineCall('fwd', value);
	};
	
	this.Backward = function(value)
	{
		return this.__engineCall('back', value);
	};

	this.PlayPosition = function(value)
	{
		return this.__engineCall('playposition', value);
	};
	
	this.FileBpm = function()
	{
		return this.__engineCall('file_bpm');
	};
	
	this.EQ = function()
	{
		return this.eq;
	};
	
	this.Rate = function()
	{
		return this.rate;
	};
	
	this.Play = function(value)
	{
		return this.__engineCall('play', value);
	};
	
	this.Pregain = function(value)
	{
		return this.__engineCall('pregain', value);
	};
	
	this.Duration = function()
	{
		return this.__engineCall('duration');
	};
	
	this.Hotcue = function(number)
	{
		return this.hotcues[number];
	};
	
	this.GetNumber = function()
	{
		return this.deck;
	};
	
	this.GetGroup = function()
	{
		return this.group;
	};
	
	this.Beatloop = function(beats)
	{
		return this.__engineCall('beatloop', beats);
	};
	
	this.Loop = function()
	{
		return this.__engineCall('loop_enabled');
	};
	
	this.Quantized = function(fn)
	{
		var quantized = this.__engineCall('quantize');
		
		if (!quantized) this.__engineCall('quantize', 1);
		fn();
		if (!quantized) this.__engineCall('quantize', 0);
	};
	
	this.SlipMode = function(on)
	{
		return this.__engineCall('slip_enabled', on);
	};
	
	this.Connect = function(control, func, doTrigger)
	{
		var c = engine.connectControl(this.group, control, func, true);
		if (typeof doTrigger != 'undefined' && doTrigger)
		{
			func(engine.getValue(this.group, control));
		}
		return c;
	};
	
	this.SoftTakeover = function(controls, enable)
	{
		// Implicit allocation .. I know...
		// -Phillip Whelan
		if (!Array.isArray(controls))
		{
			controls = [controls];
		}
		
		for (var c = 0; c < controls.length; c++)
		{
			engine.softTakeover(this.group, controls[c], enable);
		}
	};
	
	this.PFL = function(status)
	{
		return this.__engineCall("pfl", status);
	};
}

function Master()
{
	
	
	this.__engineCall = function(control, value)
	{
		return MixxxEngineCall('[Master]', control, value);
	};
	
	this.Connect = function(control, func, trigger)
	{
		var c = engine.connectControl('[Master]', control, func, true);
		if (typeof trigger != 'undefined' && trigger)
		{
			func(engine.getValue(this.group, control));
		}
		return c;
	};
	
	this.Balance = function(value)
	{
		return this.__engineCall('balance', value);
	};
	
	this.Crossfader = function(value)
	{
		return this.__engineCall('crossfader', value);
	};
	
	this.HeadphoneVolume = function(value)
	{
		return this.__engineCall('headVolume', value);
	};
	
	this.HeadphoneMix = function(value)
	{
		return this.__engineCall('headMix', value);
	};
	
	this.Latency = function()
	{
		return this.__engineCall('latency');
	};
	
	this.Volume = function(value)
	{
		return this.__engineCall('volume', value);
	};
	
}

function Playlist()
{
	this.__engineCall = function(control, value)
	{
		return MixxxEngineCall('[Playlist]', control, value);
	};
	
	this.Next = function()
	{
		return this.__engineCall('SelectNextPlaylist', 1);
	};
	
	this.Prev = function()
	{
		return this.__engineCall('SelectPrevPlaylist', 1);
	};
	
	this.NextTrack = function()
	{
		return this.__engineCall('SelectNextTrack', 1);
	};
	
	this.PrevTrack = function()
	{
		return this.__engineCall('SelectPrevTrack', 1);
	};
	
	this.ScrollTracks = function(value)
	{
		return this.__engineCall('SelectTrackKnob', value);
	};
	
	this.Timeout = function(timeout, fn)
	{
		return engine.beginTimer(timeout, fn, true);
	};
	
	this.Periodic = function(period, fn)
	{
		return engine.beginTimer(timeout, fn, false);
	};
}

function OnOff(__engineCall)
{
	this.Enable = function()
	{
		return __engineCall(1, true);
	};
	
	this.Disable = function()
	{
		return __engineCall(0, true);
	};
	
	this.Enabled = function()
	{
		return __engineCall();
	};
	
	this.Toggle = function()
	{
		if (this.Enabled())
		{
			this.Disable();
		}
		else
		{
			this.Enable();
		}
	};
}

function Unit(rackno, unitno)
{
	this.rack = rackno;
	this.unit = unitno;
	this.decks = [];
	var group = this.group = "[EffectRack" + rackno + "_EffectUnit"+ unitno +"]";
	this.fader = "[EffectRack" + this.rack + "_EffectUnit" + this.unit + "_Effect1]";
	
	
	var __enginecall = function(control, value)
	{
		return MixxxEngineCall(
			group,
			control,
			value
		);
	};
	
	
	this.master = new OnOff(function(onoff) {
		return __enginecall(
			"group_[Master]_enable",
			onoff
		);
	});
	
	this.headphones = new OnOff(function(onoff) {
		return __enginecall(
			"group_[Headphone]_enable",
			onoff
		);
	});
	
	
	for (var i = 0; i < 4; i++)
	{
		this.decks[i] = new OnOff(function(onoff) {
			return __enginecall(
				"group_[Channel" + (i+1) + "]_enable",
				onoff
			);
		});
	}
	
	this.Enabled = function()
	{
		return __enginecall("enabled");
	};
	
	this.Enable = function()
	{
		return __enginecall("enabled", 1);
	};
	
	this.Disable = function()
	{
		return __enginecall("enabled", 0);
	};
	
	this.Toggle = function()
	{
		if (this.Enabled())
		{
			this.Disable();
		}
		else
		{
			this.Enable();
		}
	};
	
	this.Deck = function(deckno)
	{
		return this.decks[(deckno-1)];
	};
	
	this.Master = function()
	{
		return this.master;
	};
	
	this.Headphones = function(enable)
	{
		return this.headphones;
	};
	
	/*
	this.Fader = function(control, value)
	{
		
		if (typeof value == 'undefined')
		{
			return engine.getParameter(this.fader, "parameter" + (control + 1));
		}
	};
	*/
	this.Deck = function(deckno)
	{
		return this.decks[(deckno-1)];
	};
	
	this.Master = function()
	{
		return this.master;
	};
	
	this.Headphones = function(enable)
	{
		return this.headphones;
	};
	
	this.Fader = function(control, value)
	{
		
		if (typeof value == 'undefined')
		{
			return engine.getParameter(this.fader, "parameter" + (control + 1));
		}
		
		engine.setParameter(this.fader, "parameter" + (control + 1), value);
		return value;
	};
}

function Rack(rackno)
{
	var _units = [
		new Unit(rackno, 1),
		new Unit(rackno, 2),
		new Unit(rackno, 3),
		new Unit(rackno, 4)
	];
	
	this.Unit = function(unitno)
	{
		return _units[(unitno-1)];
	};
}

function FX()
{
	var _racks = [new Rack(1)];
	
	
	this.Rack = function(rackno)
	{
		return _racks[(rackno-1)];
	};
}

/*
 * The purpose of this object is to create a wrapping API for the engine API
 * that is chainable.
 * 
 * Executing functions with this API usually follows the form of:
 * 
 *   Mixxx.Group().Control([value])
 * 
 * This is no straight forward mapping though. For example, to set Hotcues
 * one executes:
 *   
 *   Mixxx.Deck(1).Hotcue(5).Set();
 * 
 * Since the API is chainable one can execute the following to set various 
 * different hotcues:
 * 
 *   var deck = Mixxx.Deck1();
 *   for (var i = 0; i < 5; i++)
 *	 deck.Hotcue(i).Set();
 * 
 * To set and goto a Cue at once:
 * 
 *   var hotcue = Mixxx.Deck1().Hotcue(0);
 *   hotcue.Set();
 *   hotcue.Goto();
 * 
 * Or:
 * 
 *   Mixxx.Deck(1).Hotcue(0).Set().Goto();
 * 
 */

function MixxxAPI()
{
	var _decks = [new Deck(1), new Deck(2), new Deck(3), new Deck(4)],
		_midi = new MIDI(),
		_playlist = new Playlist(),
		_master = new Master();
	
	
	this.Deck = function(deck)
	{
		if (_decks[(deck-1)] === null)
		{
			_decks[(deck-1)] = new Deck(deck);
		}
		
		return _decks[(deck-1)];
	};
	
	this.MIDI = function()
	{
		return _midi;
	};
	
	this.Master = function()
	{
		return _master;
	};
	
	this.Playlist = function()
	{
		return _playlist;
	};
	
	this.FX = function()
	{
		return _fx;
	};
	
	this.init = function()
	{
		
	};
	
	this.shutdown = function()
	{
		
	};
}

var Mixxx = new MixxxAPI();

if (typeof exports != 'undefined')
{
	exports.Mixxx = Mixxx;
}
