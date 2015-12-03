var Mixxx = require('../MixxxAPI').Mixxx;
var engine = require('./engine');
var memwatch = require('memwatch');


console.log("Start Testing MIXXX API");

//var hd = new memwatch.HeapDiff();

///////////////////////////////
Mixxx.Deck(1).Cue();
Mixxx.Deck(1).Cue(0);
Mixxx.Deck(1).Cue(1);

///////////////////////////////
Mixxx.Deck(1).Bpm();
Mixxx.Deck(1).FileBpm();

///////////////////////////////
Mixxx.Deck(1).Beatsync();
Mixxx.Deck(1).Beatsync(0);
Mixxx.Deck(1).Beatsync(1);

///////////////////////////////
Mixxx.Deck(1).End();

///////////////////////////////
Mixxx.Deck(1).Backward(1);
Mixxx.Deck(1).Forward(1);

///////////////////////////////
Mixxx.Deck(1).PlayPosition();

///////////////////////////////
Mixxx.Deck(1).EQ().High().Set(1);
Mixxx.Deck(1).EQ().High().Kill(1);
///////////////////////////////
Mixxx.Deck(1).EQ().Mid().Get();
Mixxx.Deck(1).EQ().Mid().Kill(1);
///////////////////////////////
Mixxx.Deck(1).EQ().Low().Set(1);
Mixxx.Deck(1).EQ().Low().Killed();

///////////////////////////////
Mixxx.Deck(1).Rate().PermUp();
Mixxx.Deck(1).Rate().PermDown();
///////////////////////////////
Mixxx.Deck(1).Rate().PermUpSmall();
Mixxx.Deck(1).Rate().PermDownSmall();
///////////////////////////////
Mixxx.Deck(1).Rate().PermUp();
Mixxx.Deck(1).Rate().PermDown();
///////////////////////////////
Mixxx.Deck(1).Rate().TempUp();
Mixxx.Deck(1).Rate().TempDown();
///////////////////////////////
Mixxx.Deck(1).Rate().ShiftUp();
Mixxx.Deck(1).Rate().ShiftDown();

///////////////////////////////
Mixxx.Deck(1).Play(1);
Mixxx.Deck(1).Pregain();
Mixxx.Deck(1).Duration();
Mixxx.Deck(1).GetNumber();

Mixxx.Deck(1).Connect('playposition', function() {
	console.log("I AM WOEFUL");
});

engine.dumpcalls();
///////////////////////////////
Mixxx.Deck(1).Hotcue(1).Activate();
Mixxx.Deck(1).Hotcue(1).Clear();
Mixxx.Deck(1).Hotcue(1).Enabled();
Mixxx.Deck(1).Hotcue(1).Goto();
Mixxx.Deck(1).Hotcue(1).GotoAndStop();
Mixxx.Deck(1).Hotcue(1).Position();
Mixxx.Deck(1).Hotcue(1).Set();
console.log(engine.dumpcalls());

///////////////////////////////
Mixxx.Playlist().Next();
Mixxx.Playlist().Prev();
Mixxx.Playlist().NextTrack();
Mixxx.Playlist().PrevTrack();
Mixxx.Playlist().ScrollTracks();

///////////////////////////////
engine.dumpcalls();
Mixxx.FX().Rack(1).Unit(1).Enabled();
Mixxx.FX().Rack(1).Unit(1).Enable();
Mixxx.FX().Rack(1).Unit(1).Disable();
Mixxx.FX().Rack(1).Unit(2).Master().Disable();
Mixxx.FX().Rack(1).Unit(3).Headphones().Enable();
Mixxx.FX().Rack(1).Unit(2).Deck(1).Enabled();
Mixxx.FX().Rack(1).Unit(2).Deck(2).Disable();
Mixxx.FX().Rack(1).Unit(4).Fader(1, 0.5);
Mixxx.FX().Rack(1).Unit(4).Fader(2);
//console.log(engine.dumpcalls());

///////////////////////////////
Mixxx.Master().Connect('volume', function() {
	console.log("BOO YEAH");
});
///////////////////////////////
Mixxx.Master().Balance();
Mixxx.Master().Crossfader(0.5);
Mixxx.Master().Crossfader(0.1);
///////////////////////////////
Mixxx.Master().HeadphoneVolume(1.0);
Mixxx.Master().HeadphoneMix(1.0);
///////////////////////////////
Mixxx.Master().Latency();
Mixxx.Master().Volume();

///////////////////////////////
Mixxx.MIDI().Send(0x90, 0x90, 1);
Mixxx.MIDI().SendSysex(4, "FOOR");
Mixxx.MIDI().SendSysex("FOOR");

//var diff = hd.end();
//console.log(diff);

console.log("DONE!");
