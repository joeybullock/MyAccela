function copyFees(sourceCapId,targetCapId)
	{

	var feeSeqArray = new Array();
	var invoiceNbrArray = new Array();
	var feeAllocationArray = new Array();

	var feeA = loadFees(sourceCapId)

	for (x in feeA)
		{
		thisFee = feeA[x];
		
		logMessage("We have a fee " + thisFee.code + " status : " + thisFee.status);
		
		if (thisFee.status == "INVOICED")
			{
			addFee(thisFee.code,thisFee.sched,thisFee.period,thisFee.unit,"Y",targetCapId)

			var feeSeqArray = new Array();
			var paymentPeriodArray = new Array();

			feeSeqArray.push(thisFee.sequence);
			paymentPeriodArray.push(thisFee.period);
			var invoiceResult_L = aa.finance.createInvoice(sourceCapId, feeSeqArray, paymentPeriodArray);

			if (!invoiceResult_L.getSuccess())
				aa.print("**ERROR: Invoicing the fee items voided " + thisFee.code + " was not successful.  Reason: " +  invoiceResult_L.getErrorMessage());
			}


		if (thisFee.status == "NEW")
			{
			addFee(thisFee.code,thisFee.sched,thisFee.period,thisFee.unit,"N",targetCapId)
			}

		}

	}
