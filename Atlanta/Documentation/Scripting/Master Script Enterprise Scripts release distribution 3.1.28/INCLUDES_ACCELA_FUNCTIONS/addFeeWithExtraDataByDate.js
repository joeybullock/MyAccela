
function addFeeWithExtraDataByDate(feeCap, fdate, fcode, fsched, fperiod, fqty, finvoice, feeCap, feeComment, UDF1, UDF2) {
	// Updated Script will return feeSeq number or null if error encountered (SR5112)
	
	var feeSeq_L = new Array(); // invoicing fee for CAP in args
	var paymentPeriod_L = new Array(); // invoicing pay periods for CAP in args
	var feeSeq = null;
	var feeCapMessage = " to " + feeCap.getCustomID();

	var f = aa.proxyInvoker.newInstance("com.accela.aa.finance.fee.RefFeeBusiness").getOutput();
	if (!f) { logDebug("could not instantiate RefFeeBusiness to determine fee version, exiting addFeeByDate");
	return false;
	}
	
	var vDate = convertDate(fdate);
	
	if (!vDate) { logDebug("could not convert date parameter to javascript date, exiting addFeeByDate");
	return false;
	}
	
	var v = f.getDefaultVersionBySchedule(aa.getServiceProviderCode(),fsched,vDate,"ADMIN");

	if (!v) { logDebug("could not determine default version for fee schedule " + fsched + ", exiting addFeeByDate");
	return false;
	}
	
    assessFeeResult = aa.finance.createFeeItem(feeCap, fsched, fcode, fperiod, fqty);
    if (assessFeeResult.getSuccess()) {
        feeSeq = assessFeeResult.getOutput();
		logDebug("Successfully added Fee:" + fcode + ", Qty:" + fqty + " Version:" + v + " Sched: " + fsched + " based on date " + vDate + " " + feeCapMessage + ".  The assessed fee Sequence Number " + feeSeq + feeCapMessage);

        fsm = aa.finance.getFeeItemByPK(feeCap, feeSeq).getOutput().getF4FeeItem();

        if (feeComment) fsm.setFeeNotes(feeComment);
        if (UDF1) fsm.setUdf1(UDF1);
        if (UDF2) fsm.setUdf2(UDF2);

        aa.finance.editFeeItem(fsm)


        if (finvoice == "Y" && arguments.length == 5) // use current CAP
        {
            feeSeqList.push(feeSeq);
            paymentPeriodList.push(fperiod);
        }
        if (finvoice == "Y" && arguments.length > 5) // use CAP in args
        {
            feeSeq_L.push(feeSeq);
            paymentPeriod_L.push(fperiod);
            var invoiceResult_L = aa.finance.createInvoice(feeCap, feeSeq_L, paymentPeriod_L);
            if (invoiceResult_L.getSuccess())
                logMessage("Invoicing assessed fee items is successful.");
            else
                logDebug("**ERROR: Invoicing the fee items assessed was not successful.  Reason: " + invoiceResult.getErrorMessage());
        }
    }
    else {
        logDebug("**ERROR: assessing fee (" + fcode + "): " + assessFeeResult.getErrorMessage());
        return null;
    }

    return feeSeq;

}
