function getInspectionScheduleParams4Notification(params) {

	// pass in a hashtable and it will add the additional parameters to the table
	// This should be called from InspectionScheduleAfter Event

	if (inspId) addParameter(params, "$$inspId$$", inspId);

	if (inspInspector) addParameter(params, "$$inspInspector$$", inspInspector);

	if (InspectorFirstName) addParameter(params, "$$InspectorFirstName$$", InspectorFirstName);

	if (InspectorMiddleName) addParameter(params, "$$InspectorMiddleName$$", InspectorMiddleName);

	if (InspectorLastName) addParameter(params, "$$InspectorLastName$$", InspectorLastName);

	if (inspGroup) addParameter(params, "$$inspGroup$$", inspGroup);
	
	if (inspType) addParameter(params, "$$inspType$$", inspType);
	
	if (inspSchedDate) addParameter(params, "$$inspSchedDate$$", inspSchedDate);

	return params;

}

