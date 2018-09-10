function addParcelAndOwnerFromRefAddress(refAddress) // optional capID
{

	var itemCap = capId
		if (arguments.length > 1)
			itemCap = arguments[1]; // use cap ID specified in args

		// first add the primary parcel
		//
		var primaryParcelResult = aa.parcel.getPrimaryParcelByRefAddressID(refAddress, "Y");
	if (primaryParcelResult.getSuccess())
		var primaryParcel = primaryParcelResult.getOutput();
	else {
		logDebug("**ERROR: Failed to get primary parcel for ref Address " + refAddress + " , " + primaryParcelResult.getErrorMessage());
		return false;
	}

	var capParModel = aa.parcel.warpCapIdParcelModel2CapParcelModel(itemCap, primaryParcel).getOutput()

		var createPMResult = aa.parcel.createCapParcel(capParModel);
	if (createPMResult.getSuccess())
		logDebug("created CAP Parcel");
	else {
		logDebug("**WARNING: Failed to create the cap Parcel " + createPMResult.getErrorMessage());
	}

	// Now the owners
	//

	var parcelListResult = aa.parcel.getParcelDailyByCapID(itemCap, null);
	if (parcelListResult.getSuccess())
		var parcelList = parcelListResult.getOutput();
	else {
		logDebug("**ERROR: Failed to get Parcel List " + parcelListResult.getErrorMessage());
		return false;
	}

	for (var thisP in parcelList) {
		var ownerListResult = aa.owner.getOwnersByParcel(parcelList[thisP]);
		if (ownerListResult.getSuccess())
			var ownerList = ownerListResult.getOutput();
		else {
			logDebug("**ERROR: Failed to get Owner List " + ownerListResult.getErrorMessage());
			return false;
		}

		for (var thisO in ownerList) {
			ownerList[thisO].setCapID(itemCap);
			createOResult = aa.owner.createCapOwnerWithAPOAttribute(ownerList[thisO]);

			if (createOResult.getSuccess())
				logDebug("Created CAP Owner");
			else {
				logDebug("**WARNING: Failed to create CAP Owner " + createOResult.getErrorMessage());
			}
		}
	}
}
