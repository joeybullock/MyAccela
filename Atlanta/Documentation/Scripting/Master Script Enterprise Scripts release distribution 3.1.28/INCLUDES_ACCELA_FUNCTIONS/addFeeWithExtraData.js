
function addFeeWithExtraData(fcode, fsched, fperiod, fqty, finvoice, feeCap, feeComment, UDF1, UDF2) {
    var feeCapMessage = "";
    var feeSeq_L = new Array(); 			// invoicing fee for CAP in args
    var paymentPeriod_L = new Array(); 		// invoicing pay periods for CAP in args

    assessFeeResult = aa.finance.createFeeItem(feeCap, fsched, fcode, fperiod, fqty);
    if (assessFeeResult.getSuccess()) {
        feeSeq = assessFeeResult.getOutput();
        logMessage("Successfully added Fee " + fcode + ", Qty " + fqty + feeCapMessage);
        logDebug("The assessed fee Sequence Number " + feeSeq + feeCapMessage);

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
