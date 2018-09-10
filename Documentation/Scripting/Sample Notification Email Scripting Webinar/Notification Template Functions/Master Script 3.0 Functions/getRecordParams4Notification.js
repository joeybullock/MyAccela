 function getRecordParams4Notification(params) {

	// pass in a hashtable and it will add the additional parameters to the table



	addParameter(params, "$$altID$$", capIDString);

	addParameter(params, "$$capName$$", capName);

	addParameter(params, "$$capStatus$$", capStatus);

	addParameter(params, "$$fileDate$$", fileDate);

	//addParameter(params, "$$workDesc$$", workDescGet(capId));

	addParameter(params, "$$balanceDue$$", "$" + parseFloat(balanceDue).toFixed(2));

	

	return params;

}



