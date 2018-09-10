true ^ showDebug = true; showMessage = false;
true ^ branch("CMN:*/*/*/*:GET_APP_PARTS");
true ^ branch("WTUA:" + cmnGroup + "/*/*/*");
true ^ branch("WTUA:" + cmnGroup + "/" + cmnType + "/*/*");
true ^ branch("WTUA:" + cmnGroup + "/" + cmnType + "/" + cmnSubType + "/*");
true ^ branch("WTUA:" + appTypeString);
wfTask == "Inspection" && wfStatus == "Inspection Passed" ^ closeTask ("Issue Certificate of Occupancy","COO Issued/App Completed","Closed by Script","Closed by Script");
wfTask == "Inspection" && wfStatus == "Inspection Passed" ^ closeTask ("Certificate of Occupancy" , "COO Issued/AppComplete" , "Closed by Script" , "Closed by Script");