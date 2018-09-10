function feeBalanceFromDate(searchDays,feestr)
	{
	// Searches payment fee items and returns the unpaid balance of a fee item
	// searchDays = Days in future or past to search for ex. -120 would search for today -120 days
	// feestr = Fee Code to search for
	// optional 3rd parameter Fee Schedule
	// to get balance of fee schedule use following example feeBalanceFromDate(-120,null,"SCHEDULE");
	// to get balance of all fees use following feeBalanceFromDate(-120,null);
	var amtFee = 0;
	var amtPaid = 0;
	var feeSch;
	var jsFeeDate = new Date();
	
	var jsStartDate = new Date();
	jsStartDate.setDate(jsStartDate.getDate() + searchDays);
	

	if (arguments.length == 3) feeSch = arguments[2]; 

	var feeResult=aa.fee.getFeeItems(capId);
	if (feeResult.getSuccess())
		{ var feeObjArr = feeResult.getOutput(); }
	else
		{ logDebug( "**ERROR: getting fee items: " + capContResult.getErrorMessage()); return false }
	
	for (ff in feeObjArr)
	{
		jsFeeDate.setTime(feeObjArr[ff].getApplyDate().getEpochMilliseconds());
		if ((!feestr || feestr.equals(feeObjArr[ff].getFeeCod())) && (!feeSch || feeSch.equals(feeObjArr[ff].getF4FeeItemModel().getFeeSchudle())) && (jsFeeDate  >= jsStartDate))
			{
			amtFee+=feeObjArr[ff].getFee();
			var pfResult = aa.finance.getPaymentFeeItems(capId, null);
			if (pfResult.getSuccess())
				{
				var pfObj = pfResult.getOutput();
				for (ij in pfObj)
					if (feeObjArr[ff].getFeeSeqNbr() == pfObj[ij].getFeeSeqNbr())
						amtPaid+=pfObj[ij].getFeeAllocation()
				}
			}
	}
	return amtFee - amtPaid;
	}