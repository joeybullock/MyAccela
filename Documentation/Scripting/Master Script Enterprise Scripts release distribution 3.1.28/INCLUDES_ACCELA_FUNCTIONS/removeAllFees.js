function removeAllFees(itemCap) // Removes all non-invoiced fee items for a CAP ID
{
	getFeeResult = aa.fee.getFeeItems(itemCap, null, "NEW");
	if (getFeeResult.getSuccess()) {
		var feeList = getFeeResult.getOutput();
		for (feeNum in feeList) {
			if (feeList[feeNum].getFeeitemStatus().equals("NEW")) {
				var feeSeq = feeList[feeNum].getFeeSeqNbr();

				var editResult = aa.finance.removeFeeItem(itemCap, feeSeq);
				if (editResult.getSuccess()) {
					logDebug("Removed existing Fee Item: " + feeList[feeNum].getFeeCod());
				} else {
					logDebug("**ERROR: removing fee item (" + feeList[feeNum].getFeeCod() + "): " + editResult.getErrorMessage());
					break
				}
			}
			if (feeList[feeNum].getFeeitemStatus().equals("INVOICED")) {
				logDebug("Invoiced fee " + feeList[feeNum].getFeeCod() + " found, not removed");
			}
		}
	} else {
		logDebug("**ERROR: getting fee items (" + feeList[feeNum].getFeeCod() + "): " + getFeeResult.getErrorMessage())
	}

}