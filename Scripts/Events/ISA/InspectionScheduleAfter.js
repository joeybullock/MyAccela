true ^ showDebug = false; showMessage = false;
true ^ branch("CMN:*/*/*/*:GET_APP_PARTS");
true ^ branch("ISA:" + cmnGroup + "/*/*/*");
true ^ branch("ISA:" + cmnGroup + "/" + cmnType + "/*/*");
true ^ branch("ISA:" + cmnGroup + "/" + cmnType + "/" + cmnSubType + "/*");
true ^ branch("ISA:" + appTypeString);
cap.isCreatedByACA() && inspType == "345 Fire Rough" ^ scheduleInspection("345 Fire Rough",0,"SDCHRISTIAN");
cap.isCreatedByACA() && inspType == "350 Fire Final" ^ scheduleInspection("350 Fire Final",0,"SDCHRISTIAN");