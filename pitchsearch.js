// ----------------- BEGIN Pitch/Search functions -----------------
// Implementation of Pitch/Search function for pitch bend buttons
// when the track is paused the buttons will search in a track,
// moving backwards or forwards. When the track is playing it
// will do temporary rate changes.

function PitchSearch() {}

PitchSearch.init = function(id)
{
    PitchSearch.LastBwdStatus = { Channel1: 0, Channel2: 0 };
    PitchSearch.LastFwdStatus = { Channel1: 0, Channel2: 0 };
}

PitchSearch.shutdown = function()
{
    PitchSearch.LastBwdStatus = null;
    PitchSearch.LastFwdStatus = null;
}

// ----------   Functions   ----------
PitchSearch.backward = function(channel, control, value, status, group)
{
    var playstatus = engine.getValue(group, "play");
    
    
    if ((value == 0) && (PitchSearch.LastBwdStatus[group] != playstatus)) {
        var newstatus = playstatus;
        
        playstatus = PitchSearch.LastBwdStatus[group];
        PitchSearch.LastBwdStatus[group] = newstatus;
    }
    else
        PitchSearch.LastBwdStatus[group] = playstatus;
    
    
    if ((playstatus)) {
        engine.setValue(group, "rate_temp_down", (value ? 1 : 0));
    }
    else {
        engine.setValue(group, "back", (value ? 1 : 0));
    }
    
}

PitchSearch.forward = function(channel, control, value, status, group) 
{
    var playstatus = engine.getValue(group, "play");
    
    
    if ((value == 0) && (PitchSearch.LastFwdStatus[group] != playstatus)) {
        var newstatus = playstatus;
        
        playstatus = PitchSearch.LastFwdStatus[group];
        PitchSearch.LastFwdStatus[group] = newstatus;
    }
    else
        PitchSearch.LastFwdStatus[group] = playstatus;
    
    
    if ((playstatus)) {
        engine.setValue(group, "rate_temp_up", (value ? 1 : 0));
    }
    else {
        engine.setValue(group, "fwd", (value ? 1 : 0));
    }
}

// ----------------- END Pitch/Search functions -------------------
