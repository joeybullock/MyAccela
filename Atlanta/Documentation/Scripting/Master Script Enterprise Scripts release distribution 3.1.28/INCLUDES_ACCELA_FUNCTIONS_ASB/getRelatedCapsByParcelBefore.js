function getRelatedCapsByParcelBefore(ats) 
//
// appsubmitBefore script only.  Returns an array of capids that match the parcelValidatedNumber
// ats, app type string to check for
//
	{
	var retArr = new Array();
	

	// get caps with same parcel
	var capAddResult = aa.cap.getCapListByParcelID(ParcelValidatedNumber,null);
	if (capAddResult.getSuccess())
		{ var capIdArray=capAddResult.getOutput(); }
	else
		{ logDebug("**ERROR: getting similar parcels: " + capAddResult.getErrorMessage());  return false; }

	// loop through related caps
	for (cappy in capIdArray)
		{
		var relcap = aa.cap.getCap(capIdArray[cappy].getCapID()).getOutput();
		// get cap type

		var reltypeArray = relcap.getCapType().toString().split("/");


		var isMatch = true;
		var ata = ats.split("/");
		if (ata.length != 4)
			logDebug("**ERROR: The following Application Type String is incorrectly formatted: " + ats);
		else
			for (xx in ata)
				if (!ata[xx].equals(reltypeArray[xx]) && !ata[xx].equals("*"))
					isMatch = false;

		if (isMatch)			
			retArr.push(capIdArray[cappy]);

		} // loop through related caps
		
	if (retArr.length > 0)
		return retArr;
		
	}
