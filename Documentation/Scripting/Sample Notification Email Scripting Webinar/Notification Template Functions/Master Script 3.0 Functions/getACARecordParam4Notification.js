 function getACARecordParam4Notification(params,acaUrl) {
	// pass in a hashtable and it will add the additional parameters to the table

	addParameter(params, "$$acaRecordUrl$$", getACARecordURL(acaUrl));
	
	return params;	
}

