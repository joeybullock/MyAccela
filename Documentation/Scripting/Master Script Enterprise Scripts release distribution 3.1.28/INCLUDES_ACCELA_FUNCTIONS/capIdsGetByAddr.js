function capIdsGetByAddr() {
	//Gets CAPs with the same address as the current CAP, as capId (CapIDModel) object array (array includes current capId)
	//07SSP-00034/SP5015
	//

	//Get address(es) on current CAP
	var addrResult = aa.address.getAddressByCapId(capId);
	if (!addrResult.getSuccess()) {
		logDebug("**ERROR: getting CAP addresses: " + addrResult.getErrorMessage());
		return false;
	}

	var addrArray = new Array();
	var addrArray = addrResult.getOutput();
	if (addrArray.length == 0 || addrArray == undefined) {
		logDebug("The current CAP has no address.  Unable to get CAPs with the same address.")
		return false;
	}

	//use 1st address for comparison
	var streetName = addrArray[0].getStreetName();
	var hseNum = addrArray[0].getHouseNumberStart();
	var streetSuffix = addrArray[0].getStreetSuffix();
	var zip = addrArray[0].getZip();
	var streetDir = addrArray[0].getStreetDirection();

	if (streetDir == "")
		streetDir = null;
	if (streetSuffix == "")
		streetSuffix = null;
	if (zip == "")
		zip = null;

	if (hseNum && !isNaN(hseNum)) {
		hseNum = parseInt(hseNum);
	} else {
		hseNum = null;
	}

	// get caps with same address
	var capAddResult = aa.cap.getCapListByDetailAddress(streetName, hseNum, streetSuffix, zip, streetDir, null);
	if (capAddResult.getSuccess())
		var capArray = capAddResult.getOutput();
	else {
		logDebug("**ERROR: getting similar addresses: " + capAddResult.getErrorMessage());
		return false;
	}

	var capIdArray = new Array();
	//convert CapIDScriptModel objects to CapIDModel objects
	for (i in capArray)
		capIdArray.push(capArray[i].getCapID());

	if (capIdArray)
		return (capIdArray);
	else
		return false;
}