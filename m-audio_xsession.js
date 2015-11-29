function XSession() {}

XSession.init = function()
{
    XSession.PlayBrowseMode = false;
    XSession.LoadTrack = false;
}

XSession.shutdown = function()
{
}

XSession.Backward = function(channel, control, value, status, group)
{
    if ( XSession.PlayBrowseMode && (value > 0)) {
        XSession.LoadTrack = true;
        print("NEXT TRACK");
        engine.setValue("[Playlist]","SelectPrevTrack", (value > 0));
    }
    else
        PitchSearch.backward(channel, control, value, status, group);
}

XSession.Forward = function(channel, control, value, status, group)
{
    if ( XSession.PlayBrowseMode && (value > 0)) {
        XSession.LoadTrack = true;
        print("PREV TRACK");
        engine.setValue("[Playlist]","SelectNextTrack", (value > 0));
    }
    else
        PitchSearch.forward(channel, control, value, status, group);
}

XSession.PlayBrowse = function(channel, control, value, status, group)
{
    print("ARGS = " + channel + ","  + control + ","  +  value + ","  +  status + ","  +  group);
    
    var playstatus = engine.getValue(group, "play");
    if ( value )
        engine.setValue(group, "play", !playstatus);
    
    if ( value && playstatus )
        XSession.PlayBrowseMode = true;
    else if ( value == 0 && XSession.PlayBrowseMode ) {
        if ( XSession.LoadTrack ) {
            XSession.LoadTrack = false;
            engine.setValue(group, "LoadSelectedTrack", 1);
        }
        
        XSession.PlayBrowseMode = false;
    }
}
