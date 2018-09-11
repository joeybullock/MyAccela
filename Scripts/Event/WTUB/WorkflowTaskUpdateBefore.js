true ^ showDebug = false; showMessage = true;
true ^ branch("CMN:*/*/*/*:GET_APP_PARTS");
true ^ branch("WTUB:" + cmnGroup + "/*/*/*");
true ^ branch("WTUB:" + cmnGroup + "/" + cmnType + "/*/*");
true ^ branch("WTUB:" + cmnGroup + "/" + cmnType + "/" + cmnSubType + "/*");
true ^ branch("WTUB:" + appTypeString);