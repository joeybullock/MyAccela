
function getRelatedCapsByParcel(ats) 
//
// returns and array of capids that match parcels on the current app.  Includes all parcels.
// ats, app type string to check for
//
	{
	var retArr = new Array();
	
	var capParcelResult = aa.parcel.getParcelandAttribute(capId,null);
	if (capParcelResult.getSuccess())
		{ var Parcels = capParcelResult.getOutput().toArray(); }
	else	
		{ logDebug("**ERROR: getting parcels by cap ID: " + capParcelResult.getErrorMessage()); return false; }

	for (zz in Parcels)
		{
		var ParcelValidatedNumber = Parcels[zz].getParcelNumber();

		// get caps with same parcel
		var capAddResult = aa.cap.getCapListByParcelID(ParcelValidatedNumber,null);
		if (capAddResult.getSuccess())
			{ var capIdArray=capAddResult.getOutput(); }
		else
			{ logDebug("**ERROR: getting similar parcels: " + capAddResult.getErrorMessage());  return false; }

		// loop through related caps
		for (cappy in capIdArray)
			{
			// skip if current cap
			if (capId.getCustomID().equals(capIdArray[cappy].getCustomID()))
				continue;
			
			// get cap ids			
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
		}
		
	if (retArr.length > 0)
		return retArr;
		
	}

