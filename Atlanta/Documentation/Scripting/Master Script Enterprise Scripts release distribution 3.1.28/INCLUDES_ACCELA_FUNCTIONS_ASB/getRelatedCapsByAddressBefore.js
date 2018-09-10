function getRelatedCapsByAddressBefore(ats) 
//
// returns the capId object of the parent.  Assumes only one parent!
//
	{
	var retArr = new Array();
	
	
	if (AddressValidatedNumber > 0) // get the address info from lookup table
	  {
	  addObj = aa.address.getRefAddressByPK(parseInt(AddressValidatedNumber)).getOutput();
	  AddressStreetName = addObj.getStreetName();
	  AddressHouseNumber = addObj.getHouseNumberStart();
	  AddressStreetSuffix = addObj.getStreetSuffix();
	  AddressZip = addObj.getZip();
	  AddressStreetDirection = addObj.getStreetDirection();
	  }

	 if (AddressStreetDirection == "") AddressStreetDirection = null;
	 if (AddressHouseNumber == "") AddressHouseNumber = 0;
	 if (AddressStreetSuffix == "") AddressStreetSuffix = null;
	 if (AddressZip == "") AddressZip = null;
 
 	// get caps with same address
 	capAddResult = aa.cap.getCapListByDetailAddress(AddressStreetName,parseInt(AddressHouseNumber),AddressStreetSuffix,AddressZip,AddressStreetDirection,null);
	if (capAddResult.getSuccess())
		{ var capIdArray=capAddResult.getOutput(); }
	else
		{ logDebug("**ERROR: getting similar addresses: " + capAddResult.getErrorMessage());  return false; }


	// loop through related caps
	for (cappy in capIdArray)
		{
		// get file date
		relcap = aa.cap.getCap(capIdArray[cappy].getCapID()).getOutput();

		// get cap type

		reltype = relcap.getCapType().toString();

		var isMatch = true;
		var ata = ats.split("/");
		if (ata.length != 4)
			logDebug("**ERROR: The following Application Type String is incorrectly formatted: " + ats);
		else
			for (xx in ata)
				if (!ata[xx].equals(appTypeArray[xx]) && !ata[xx].equals("*"))
					isMatch = false;

		if (isMatch)			
			retArr.push(capIdArray[cappy]);

		} // loop through related caps

	if (retArr.length > 0)
		return retArr;
		
	}
	