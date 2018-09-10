function validateGisObjects()
	{
	// returns true if the app has GIS objects that validate in GIS
	//
	var gisObjResult = aa.gis.getCapGISObjects(capId); // get gis objects on the cap
	if (gisObjResult.getSuccess()) 	
		var fGisObj = gisObjResult.getOutput();
	else
		{ logDebug("**WARNING: Getting GIS objects for Cap.  Reason is: " + gisObjResult.getErrorType() + ":" + gisObjResult.getErrorMessage()) ; return false }

	for (a1 in fGisObj) // for each GIS object on the Cap
		{
		var gischk = aa.gis.getGISObjectAttributes(fGisObj[a1]);

		if (gischk.getSuccess())
			var gisres = gischk.getOutput();
		else
			{ logDebug("**WARNING: Retrieving GIS Attributes.  Reason is: " + gischk.getErrorType() + ":" + gischk.getErrorMessage()) ; return false }	
		
		if (gisres != null)
			return true;  // we have a gis object from GIS
		}
	}

