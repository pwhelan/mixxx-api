// ----------------- BEGIN SmoothSlider functions -----------------
SmoothSlider = function() {}

SmoothSlider.generateTable = function(mrange, step)
{
	var range = Math.round(mrange * 100);
	if (( range % 10 ) && (range != 8))
		range += ( range - (range % 10 ));
	
	print("GENERATING TABLE FOR: " + range + " => " + step);
	
	SmoothSlider.Range = range;

	// Clear Table with NaN's
	for (var i = 0; i <= 127; i++)
		SmoothSlider.sliderTable[i] = NaN;
	
	
	var steps = (range / step).toFixed(0);
	var pos = ((127-1)/2-1);
	var left = pos % steps;
	var steps = (pos / steps).toFixed(0);
	
	
	if ( steps <= 0 ) {
		print('Not Enough MIDI Steps...');
		return;
	}
	
	for (var i = 0; i <= 127; i++) {
		var q = (i - pos - 1);
		var perc;
		
		
		if ( Math.abs(q) < (left/2)) {
			perc = 0;
		}
		else {
			if ( q > 0)
				q = q - (left/2);
			else
				q = q + (left/2);
			
			perc = (q * (step / steps))
		}
		
		if ( perc < -range )
			perc = -range;
		else if ( perc > range )
			perc = range;
		
		SmoothSlider.sliderTable[i] = perc;
	}
	
}

SmoothSlider.regenerateTable = function()
{
	SmoothSlider.generateTable(engine.getValue("[Channel1]", "rateRange"), 0.7);
}

SmoothSlider.init = function(id)
{
	// Generated externally
	SmoothSlider.sliderTable = new Array();
	SmoothSlider.generateTable(engine.getValue("[Channel1]", "rateRange"), 0.7);
	
	engine.connectControl("[Channel1]","rateRange","SmoothSlider.regenerateTable");
}

SmoothSlider.shutdown = function()
{
}

SmoothSlider.pitchShift = function(channel, control, value, status, group)
{
	var pitch = SmoothSlider.sliderTable[value];
	var rate = 0;
	
	
	if ( isNaN(pitch)) {
		print("USING DEFAULT VALUE FOR SMOOTH SLIDER !#@");
		rate = script.absoluteSlider(group, "rate", value, -2, 1);
	}
	else {
		rate = pitch / SmoothSlider.Range;
		
		print("Value[" + value + "] = " +  pitch + " / " + rate);
		engine.setValue(group, "rate", rate);
	}
}

// ----------------- END SmoothSlider functions -------------------
