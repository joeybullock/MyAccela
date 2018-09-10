
function transferFeesAndPayments(sourceCapId, targetCapId) {
	//
	// Step 1: Unapply payments from the Source
	//
	var piresult = aa.finance.getPaymentByCapID(capId, null).getOutput()

		var feeSeqArray = new Array();
	var invoiceNbrArray = new Array();
	var feeAllocationArray = new Array();

	for (ik in piresult) {
		var thisPay = piresult[ik];
		var pfResult = aa.finance.getPaymentFeeItems(capId, null);
		if (pfResult.getSuccess()) {
			var pfObj = pfResult.getOutput();
			for (ij in pfObj)
				if (pfObj[ij].getPaymentSeqNbr() == thisPay.getPaymentSeqNbr()) {
					feeSeqArray.push(pfObj[ij].getFeeSeqNbr());
					invoiceNbrArray.push(pfObj[ij].getInvoiceNbr());
					feeAllocationArray.push(pfObj[ij].getFeeAllocation());
				}
		}

		if (feeSeqArray.length > 0) {
			z = aa.finance.applyRefund(capId, thisPay, feeSeqArray, invoiceNbrArray, feeAllocationArray, "FeeStat", "InvStat", "123");
			if (z.getSuccess()) {
				logDebug("Refund applied");
			} else {
				logDebug("Error applying refund " + z.getErrorMessage());
			}
		}
	}

	//
	// Step 2: add the fees to the target and void from the source
	//

	feeA = loadFees();

	for (var x in feeA) {
		thisFee = feeA[x];
		logDebug("status is " + thisFee.status);
		if (thisFee.status == "INVOICED") {
			addFee(thisFee.code, thisFee.sched, thisFee.period, thisFee.unit, "Y", targetCapId);
			voidResult = aa.finance.voidFeeItem(capId, thisFee.sequence);
			if (voidResult.getSuccess()) {
				logDebug("Fee item " + thisFee.code + "(" + thisFee.sequence + ") has been voided");
			} else {
				logDebug("**ERROR: voiding fee item " + thisFee.code + "(" + thisFee.sequence + ") " + voidResult.getErrorMessage());
			}

			var feeSeqArray = new Array();
			var paymentPeriodArray = new Array();

			feeSeqArray.push(thisFee.sequence);
			paymentPeriodArray.push(thisFee.period);
			var invoiceResult_L = aa.finance.createInvoice(capId, feeSeqArray, paymentPeriodArray);

			if (!invoiceResult_L.getSuccess())
				logDebug("**ERROR: Invoicing the fee items voided " + feeCapMessage + " was not successful.  Reason: " + invoiceResult.getErrorMessage());
		}

	}

	//
	// Step 3: transfer the funds from Source to Target
	//

	var unapplied = paymentGetNotAppliedTot();

	var xferResult = aa.finance.makeFundTransfer(capId, targetCapId, currentUserID, "", "", sysDate, sysDate, "", sysDate, unapplied, "NA", "Fund Transfer", "NA", "R", null, "", "NA", "");
	if (xferResult.getSuccess())
		logDebug("Successfully did fund transfer to : " + targetCapId.getCustomID());
	else
		logDebug("**ERROR: doing fund transfer to (" + targetCapId.getCustomID() + "): " + xferResult.getErrorMessage());

	//
	// Step 4: On the target, loop through payments then invoices to auto-apply
	//

	var piresult = aa.finance.getPaymentByCapID(targetCapId, null).getOutput()

		for (ik in piresult) {
			var feeSeqArray = new Array();
			var invoiceNbrArray = new Array();
			var feeAllocationArray = new Array();

			var thisPay = piresult[ik];
			var applyAmt = 0;
			var unallocatedAmt = thisPay.getAmountNotAllocated()

				if (unallocatedAmt > 0) {

					var invArray = aa.finance.getInvoiceByCapID(targetCapId, null).getOutput()

						for (var invCount in invArray) {
							var thisInvoice = invArray[invCount];
							var balDue = thisInvoice.getInvoiceModel().getBalanceDue();
							if (balDue > 0) {
								feeT = aa.invoice.getFeeItemInvoiceByInvoiceNbr(thisInvoice.getInvNbr()).getOutput();

								for (targetFeeNum in feeT) {
									var thisTFee = feeT[targetFeeNum];

									if (thisTFee.getFee() > unallocatedAmt)
										applyAmt = unallocatedAmt;
									else
										applyAmt = thisTFee.getFee(); // use balance here?

									unallocatedAmt = unallocatedAmt - applyAmt;

									feeSeqArray.push(thisTFee.getFeeSeqNbr());
									invoiceNbrArray.push(thisInvoice.getInvNbr());
									feeAllocationArray.push(applyAmt);
								}
							}
						}

						applyResult = aa.finance.applyPayment(targetCapId, thisPay, feeSeqArray, invoiceNbrArray, feeAllocationArray, "PAYSTAT", "INVSTAT", "123");

					if (applyResult.getSuccess())
						logDebug("Successfully applied payment");
					else
						logDebug("**ERROR: applying payment to fee (" + thisTFee.getFeeDescription() + "): " + applyResult.getErrorMessage());

				}
		}
}
