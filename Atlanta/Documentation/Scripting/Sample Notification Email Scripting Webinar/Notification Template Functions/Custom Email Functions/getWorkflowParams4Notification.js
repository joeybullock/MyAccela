function getWorkflowParams4Notification(params) {

	// pass in a hashtable and it will add the additional parameters to the table
	// This should be called from WorkflowTaskUpdateAfter Event

	if (wfTask) addParameter(params, "$$wfTask$$", wfTask);

	if (wfStatus) addParameter(params, "$$wfStatus$$", wfStatus);

	if (wfDate) addParameter(params, "$$wfDate$$", wfDate);

	if (wfComment) addParameter(params, "$$wfComment$$", wfComment);
	
	if (wfStaffUserID) addParameter(params, "$$wfStaffUserID$$", wfStaffUserID);
	
	if (wfHours) addParameter(params, "$$wfHours$$", wfHours);

	return params;

}