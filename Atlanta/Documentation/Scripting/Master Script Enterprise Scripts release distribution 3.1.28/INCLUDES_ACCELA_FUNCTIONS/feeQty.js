function feeQty(feestr) {
	var feeQty = 0;
	var feeResult = aa.fee.getFeeItems(capId, feestr, null);
	if (feeResult.getSuccess()) {
		var feeObjArr = feeResult.getOutput();
	} else {
		logDebug("**ERROR: getting fee items: " + capContResult.getErrorMessage());
		return false
	}

	for (ff in feeObjArr)
		if (feestr.equals(feeObjArr[ff].getFeeCod()))
			feeQty += feeObjArr[ff].getFeeUnit();

	return feeQty;
}
