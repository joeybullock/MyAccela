function getInspectionResultParams4Notification(params) {

	// pass in a hashtable and it will add the additional parameters to the table
	// This should be called from InspectionResultAfter Event

	if (inspId) addParameter(params, "$$inspId$$", inspId);

	if (inspResult) addParameter(params, "$$inspResult$$", inspResult);

	//if (inspResultComment) addParameter(params, "$$inspResultComment$$", inspResultComment);

	if (inspComment) addParameter(params, "$$inspComment$$", inspComment);

	if (inspResultDate) addParameter(params, "$$inspResultDate$$", inspResultDate);

	if (inspGroup) addParameter(params, "$$inspGroup$$", inspGroup);
	
	if (inspType) addParameter(params, "$$inspType$$", inspType);
	
	if (inspSchedDate) addParameter(params, "$$inspSchedDate$$", inspSchedDate);

	return params;

}