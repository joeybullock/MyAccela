function feeBalance(feestr) {
	// Searches payment fee items and returns the unpaid balance of a fee item
	// Sums fee items if more than one exists.  Optional second parameter fee schedule
	var amtFee = 0;
	var amtPaid = 0;
	var feeSch;

	if (arguments.length == 2)
		feeSch = arguments[1];

	var feeResult = aa.fee.getFeeItems(capId, feestr, null);
	if (feeResult.getSuccess()) {
		var feeObjArr = feeResult.getOutput();
	} else {
		logDebug("**ERROR: getting fee items: " + capContResult.getErrorMessage());
		return false
	}

	for (ff in feeObjArr)
		if (feeObjArr[ff].getFeeitemStatus() != "INVOICED" && (!feestr || feestr.equals(feeObjArr[ff].getFeeCod())) && (!feeSch || feeSch.equals(feeObjArr[ff].getF4FeeItemModel().getFeeSchudle()))) {
			amtFee += feeObjArr[ff].getFee();
			var pfResult = aa.finance.getPaymentFeeItems(capId, null);
			if (pfResult.getSuccess()) {
				var pfObj = pfResult.getOutput();
				for (ij in pfObj)
					if (feeObjArr[ff].getFeeSeqNbr() == pfObj[ij].getFeeSeqNbr())
						amtPaid += pfObj[ij].getFeeAllocation()
			}
		}
	return amtFee - amtPaid;
}