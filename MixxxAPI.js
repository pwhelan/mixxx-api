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
	
	
	this.__engineCall = function(control, value)
	{
		return this.deck.__engineCall(control, value);
	}
	
	this.__hotcueCommand = function(command, value)
	{
		var control = 'hotcue_' + this.hotcue + '_' + command;
		return this.__engineCall(control, value);
	}
	
	
	this.Activate = function()
	{
		this.__hotcueCommand('activate', 1);
		return this;
	}
	
	this.Clear = function()
	{
		this.__hotcueCommand('clear', 1);
		return this;
	}
	
	this.Enabled = function()
	{
		return this.__hotcueCommand('enabled');
	}
	
	this.Goto = function()
	{
		this.__hotcueCommand('goto', 1);
		return this;
	}
	
	this.GotoAndStop = function()
	{
		this.__hotcueCommand('gotoandstop', 1);
		return this;
	}
	
	this.Position = function()
	{
		return this.__hotcueCommand('position');
	}
	
	this.Set = function()
	{
		this.__hotcueCommand('set', 1);
		return this;
	}
		
}

function MIDI()
{
	
	
	this.SendShortMsg = function(control,status,value)
	{
		midi.sendShortMsg(control,status,value);
		return this;
	}
	
	this.SendSysexMsg = function(len, data)
	{
		if ( typeof data == 'undefined' )
		{
			data = len;
			len = data.length;
		}
		
		midi.sendSysexMsg(data, len);
		return this;
	}
		
}

function Equalizer(deck)
{
	this.deck = deck;
	
	
	this.__engineCall = function(control, value)
	{
		return this.deck.__engineCall(control, value);
	}
	
	this.Low = function(value)
	{
		return this.__engineCall('filterLow', value);
	}
	
	this.LowKill = function(value)
	{
		return this.__engineCall('filterLowKill', value);
	}
	
	this.Mid = function(value)
	{
		return this.__engineCall('filterMid', value);
	}
	
	this.MidKill = function(value)
	{
		return this.__engineCall('filterMidKill', value);
	}
	
	this.High = function(value)
	{
		return this.__engineCall('filterHigh', value);
	}
	
	this.HighKill = function(value)
	{
		return this.__engineCall('filterHighKill', value);
	}
	
}

function Rate(deck)
{
	this.deck = deck;
	
	this.__engineCall = function(control, value)
	{
		return this.deck.__engineCall(control, value);
	}
	
	this.PermUp = function()
	{
		this.__engineCall('rate_perm_up', 1);
		return this;
	}
	
	this.PermDown = function()
	{
		this.__engineCall('rate_perm_down', 1);
		return this;
	}
	
	this.PermUpSmall = function()
	{
		this.__engineCall('rate_perm_up_small', 1);
		return this;
	}
	
	this.PermDownSmall = function()
	{
		this.__engineCall('rate_perm_down_small', 1);
		return this;
	}
	
	this.TempUp = function()
	{
		this.__engineCall('rate_temp_up', 1);
		return this;
	}
	
	this.TempDown = function()
	{
		this.__engineCall('rate_temp_down', 1);
		return this;
	}
	
	this.ShiftUp = function(value)
	{
		var rate = this.__engineCall('rate');
		rate += value;
		
		this.__engineCall('rate', rate);
		return this;
	}
	
	this.ShiftDown = function(value)
	{
		return this.ShiftUp(-value);
	}
	
}

function Deck(decknum)
{
	this.deck = decknum;
	this.group = '[Channel' + this.decknum + ']';
	
	
	this.__engineCall = function(control, value)
	{
		if ( typeof this.decknum == 'undefined' || !this.decknum )
			return;
		
		MixxxEngineCall(this.group, control, value);
	}	
	
	this.Cue = function(value)
	{
		return this.__engineCall('cue_default', value);
	}
	
	this.Bpm = function(value)
	{
		return this.__engineCall('bpm', value);
	}
	
	this.Beatsync = function(value)
	{
		return this.__engineCall('beatsync', value);
	}
	
	this.End = function(value)
	{
		return this.__engineCall('end', value);
	}
	
	this.Forward = function(value)
	{
		return this.__engineCall('fwd', value);
	}
	
	this.Backward = function(value)
	{
		return this.__engineCall('back', value);
	}

	this.PlayPosition = function(value)
	{
		return this.__engineCall('playposition', value);
	}
	
	this.FileBpm = function()
	{
		return this.__engineCall('file_bpm');
	}
	
	this.EQ = function()
	{
		return new Equalizer(this);
	}
	
	this.Rate = function()
	{
		return new Rate(this);
	}
	
	this.Play = function(value)
	{
		return this.__engineCall('play', value);
	}
	
	this.Pregain = function(value)
	{
		return this.__engineCall('pregain', value);
	}
	
	this.Duration = function()
	{
		return this.__engineCall('duration');
	}
	
	this.Hotcue = function(number)
	{
		return new Hotcue(this, number);
	}
	
	this.GetNumber = function()
	{
		return this.decknum;
	}
	
	this.Connect = function(control, func)
	{
		engine.connectControl(this.group, control, func);
	}
	
}

function Master()
{
	
	
	this.__engineCall = function(control, value)
	{
		return MixxxEngineCall('[Master]', control, value);
	}
	
	this.Connect = function(control, func)
	{
		engine.connectControl('[Master]', control, func);
	}
	
	this.Balance = function(value)
	{
		return this.__engineCall('balance', value);
	}
	
	this.Crossfader = function(value)
	{
		return this.__engineCall('crossfader', value);
	}
	
	this.HeadphoneVolume = function(value)
	{
		return this.__engineCall('headVolume', value);
	}
	
	this.HeadphoneMix = function(value)
	{
		return this.__engineCall('headMix', value);
	}
	
	this.Latency = function()
	{
		return this.__engineCall('latency');
	}
	
	this.Volume = function(value)
	{
		return this.__engineCall('volume', value);
	}
	
}

function Playlist()
{
	
	
	this.__engineCall = function(control, value)
	{
		return MixxxEngineCall('[Playlist]', control, value);
	}
	
	this.Next = function()
	{
		return this.__engineCall('SelectNextPlaylist', 1);
	}
	
	this.Prev = function()
	{
		return this.__engineCall('SelectPrevPlaylist', 1);
	}
	
	this.NextTrack = function()
	{
		return this.__engineCall('SelectNextTrack', 1);
	}
	
	this.PrevTrack = function()
	{
		return this.__engineCall('SelectPrevTrack', 1);
	}
	
	this.ScrollTracks = function(value)
	{
		return this.__engineCall('SelectTrackKnob', value);
	}
	
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

var TimerFunctions = {};

function MixxxAPI()
{
	
	
	this.Deck = function(deck)
	{
		return new Deck(deck);
	}
	
	this.Midi = function()
	{
		return new MIDI();
	}
	
	this.Master = function()
	{
		return new Master();
	}
	
	this.Playlist = function()
	{
		return new Playlist();
	}
	
	this.Timer = function(ctxt, interval, func, args)
	{
		var namefunc = "func_".Math.floor(Math.random() * 1000000);
		
		TimerFunctions[namefunc] = func;
		TimerFunctions[namefunc].apply(ctxt, args);
		
		return engine.beginTimer(interval, 
				"TimerFunctions[" + namefunc + "]()");
	}
}

var Mixxx = new MixxxAPI();


