function invoiceFee(fcode, fperiod) {
	//invoices all assessed fees having fcode and fperiod
	// SR5085 LL
	var feeFound = false;
	getFeeResult = aa.finance.getFeeItemsByFeeCodeAndPeriod(capId, fcode, fperiod, "NEW");
	if (getFeeResult.getSuccess()) {
		var feeList = getFeeResult.getOutput();
		for (feeNum in feeList)
			if (feeList[feeNum].getFeeitemStatus().equals("NEW")) {
				var feeSeq = feeList[feeNum].getFeeSeqNbr();
				feeSeqList.push(feeSeq);
				paymentPeriodList.push(fperiod);
				feeFound = true;
				logDebug("Assessed fee " + fcode + " found and tagged for invoicing");
			}
	} else {
		logDebug("**ERROR: getting fee items (" + fcode + "): " + getFeeResult.getErrorMessage())
	}
	return feeFound;
}