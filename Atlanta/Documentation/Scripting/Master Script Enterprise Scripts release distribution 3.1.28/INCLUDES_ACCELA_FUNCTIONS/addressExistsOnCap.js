function addressExistsOnCap() {
	// Optional parameter, cap ID to load from
	//

	var itemCap = capId;
	if (arguments.length == 1)
		itemCap = arguments[0]; // use cap ID specified in args

	var fcapAddressObj = null;
	var capAddResult = aa.address.getAddressByCapId(itemCap);
	if (capAddResult.getSuccess())
		var fcapAddressObj = capAddResult.getOutput();
	else {
		logDebug("**ERROR: Failed to get Address object: " + capAddResult.getErrorType() + ":" + capAddResult.getErrorMessage());
		return false;
	}

	for (i in fcapAddressObj) {
		return true;
	}

	return false;
}
