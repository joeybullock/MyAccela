function removeFee(fcode, fperiod) // Removes all fee items for a fee code and period
{
	getFeeResult = aa.finance.getFeeItemsByFeeCodeAndPeriod(capId, fcode, fperiod, "NEW");
	if (getFeeResult.getSuccess()) {
		var feeList = getFeeResult.getOutput();
		for (feeNum in feeList) {
			if (feeList[feeNum].getFeeitemStatus().equals("NEW")) {
				var feeSeq = feeList[feeNum].getFeeSeqNbr();

				var editResult = aa.finance.removeFeeItem(capId, feeSeq);
				if (editResult.getSuccess()) {
					logDebug("Removed existing Fee Item: " + fcode);
				} else {
					logDebug("**ERROR: removing fee item (" + fcode + "): " + editResult.getErrorMessage());
					break
				}
			}
			if (feeList[feeNum].getFeeitemStatus().equals("INVOICED")) {
				logDebug("Invoiced fee " + fcode + " found, not removed");
			}
		}
	} else {
		logDebug("**ERROR: getting fee items (" + fcode + "): " + getFeeResult.getErrorMessage())
	}

}