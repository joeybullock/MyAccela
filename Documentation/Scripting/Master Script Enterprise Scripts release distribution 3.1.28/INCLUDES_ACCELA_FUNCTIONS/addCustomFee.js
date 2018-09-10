function addCustomFee(feeSched, feeCode, feeDescr, feeAm, feeAcc, feePeriod) {
    var feeCap = capId;
    if(feePeriod == null){
    	feePeriod="FINAL"
    }

    var newFeeResult = aa.finance.createFeeItem(feeCap, feeSched, feeCode, feePeriod, feeAm);
	if (newFeeResult.getSuccess()) {
	    var feeSeq = newFeeResult.getOutput();
	    var newFee = aa.finance.getFeeItemByPK(feeCap, feeSeq).getOutput().getF4FeeItem();
	         newFee.setFeeDescription(feeDescr);
	    if (feeAcc) newFee.setAccCodeL1(feeAcc);
	
	    var feeObj = aa.finance.editFeeItem(newFee);
	    if(feeObj.getSuccess()){
	    	logDebug("Added Custom Fee " + feeDescr);
	    }
	    else{
	    	logDebug("Error Adding Fee " + feeObj.getErrorMessage())
	    }
	}
	else{
		logDebug("Error Adding Fee " + newFeeResult.getErrorMessage());
	}
}
