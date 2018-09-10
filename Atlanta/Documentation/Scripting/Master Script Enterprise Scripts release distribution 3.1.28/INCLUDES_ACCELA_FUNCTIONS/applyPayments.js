

function applyPayments() {
	var payResult = aa.finance.getPaymentByCapID(capId, null)

		if (!payResult.getSuccess()) {
			logDebug("**ERROR: error retrieving payments " + payResult.getErrorMessage());
			return false
		}

		var payments = payResult.getOutput();

	for (var paynum in payments) {
		var payment = payments[paynum];

		var payBalance = payment.getAmountNotAllocated();
		var payStatus = payment.getPaymentStatus();

		if (payBalance <= 0)
			continue; // nothing to allocate

		if (payStatus != "Paid")
			continue; // not in paid status

		var feeResult = aa.finance.getFeeItemByCapID(capId);

		if (!feeResult.getSuccess()) {
			logDebug("**ERROR: error retrieving fee items " + feeResult.getErrorMessage());
			return false
		}

		var feeArray = feeResult.getOutput();

		for (var feeNumber in feeArray) {

			var feeItem = feeArray[feeNumber];
			var amtPaid = 0;
			var pfResult = aa.finance.getPaymentFeeItems(capId, null);

			if (feeItem.getFeeitemStatus() != "INVOICED")
				continue; // only apply to invoiced fees

			if (!pfResult.getSuccess()) {
				logDebug("**ERROR: error retrieving fee payment items items " + pfResult.getErrorMessage());
				return false
			}

			var pfObj = pfResult.getOutput();

			for (ij in pfObj)
				if (feeItem.getFeeSeqNbr() == pfObj[ij].getFeeSeqNbr())
					amtPaid += pfObj[ij].getFeeAllocation()

					var feeBalance = feeItem.getFee() - amtPaid;

			if (feeBalance <= 0)
				continue; // this fee has no balance

			var fseqlist = new Array();
			var finvlist = new Array();
			var fpaylist = new Array();

			var invoiceResult = aa.finance.getFeeItemInvoiceByFeeNbr(capId, feeItem.getFeeSeqNbr(), null);

			if (!invoiceResult.getSuccess()) {
				logDebug("**ERROR: error retrieving invoice items " + invoiceResult.getErrorMessage());
				return false
			}

			var invoiceItem = invoiceResult.getOutput();

			// Should return only one invoice number per fee item

			if (invoiceItem.length != 1) {
				logDebug("**WARNING: fee item " + feeItem.getFeeSeqNbr() + " returned " + invoiceItem.length + " invoice matches")
			} else {
				fseqlist.push(feeItem.getFeeSeqNbr());
				finvlist.push(invoiceItem[0].getInvoiceNbr());

				if (feeBalance > payBalance)
					fpaylist.push(payBalance);
				else
					fpaylist.push(feeBalance);

				applyResult = aa.finance.applyPayment(capId, payment, fseqlist, finvlist, fpaylist, "NA", "NA", "0");

				if (applyResult.getSuccess()) {
					payBalance = payBalance - fpaylist[0];
					logDebug("Applied $" + fpaylist[0] + " to fee code " + feeItem.getFeeCod() + ".  Payment Balance: $" + payBalance);
				} else {
					logDebug("**ERROR: error applying payment " + applyResult.getErrorMessage());
					return false
				}
			}

			if (payBalance <= 0)
				break;
		}
	}
}
