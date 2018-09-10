function feeAmount(feestr) {
	// optional statuses to check for (SR5082)
	//
	var checkStatus = false;
	var statusArray = new Array();

	//get optional arguments
	if (arguments.length > 1) {
		checkStatus = true;
		for (var i = 1; i < arguments.length; i++)
			statusArray.push(arguments[i]);
	}

	var feeTotal = 0;
	var feeResult = aa.fee.getFeeItems(capId, feestr, null);
	if (feeResult.getSuccess()) {
		var feeObjArr = feeResult.getOutput();
	} else {
		logDebug("**ERROR: getting fee items: " + feeResult.getErrorMessage());
		return false
	}

	for (ff in feeObjArr)
		if (feestr.equals(feeObjArr[ff].getFeeCod()) && (!checkStatus || exists(feeObjArr[ff].getFeeitemStatus(), statusArray)))
			feeTotal += feeObjArr[ff].getFee()

			return feeTotal;
}