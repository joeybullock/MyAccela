true ^ showDebug = false; showMessage = true;
true ^ branch("CMN:*/*/*/*:GET_APP_PARTS");
true ^ branch("ASB:" + cmnGroup + "/*/*/*");
true ^ branch("ASB:" + cmnGroup + "/" + cmnType + "/*/*");
true ^ branch("ASB:" + cmnGroup + "/" + cmnType + "/" + cmnSubType + "/*");
true ^ branch("ASB:" + appTypeString);