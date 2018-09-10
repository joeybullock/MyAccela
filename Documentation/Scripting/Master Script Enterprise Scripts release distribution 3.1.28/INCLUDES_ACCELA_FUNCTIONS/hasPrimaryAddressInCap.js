//check if target CAP has primary address
function hasPrimaryAddressInCap(capID) {
	var isPrimaryAddressExist = false;
	var capAddressResult = aa.address.getAddressByCapId(capID);
	if (capAddressResult.getSuccess()) {
		var addressModelArray = capAddressResult.getOutput();
		for (k in addressModelArray) {
			if ("Y" == addressModelArray[k].getPrimaryFlag()) {
				isPrimaryAddressExist = true;
				logDebug("Target CAP has primary address");
				break;
			}

		}
	} else {
		logMessage("**ERROR: Failed to get addresses: " + capAddressResult.getErrorMessage());
	}
	return isPrimaryAddressExist;
}