function transferReceiptAndApply(receiptCapId,targetCapId)
{
    var amtResult = parseFloat(aa.cashier.getSumNotAllocated(receiptCapId).getOutput());

    var bDueResult = aa.cashier.getTotalFeeAmount(targetCapId);
    var balanceDue = 0;

    if (bDueResult.getSuccess()) {
        balanceDue = bDueResult.getOutput();
    }

    var transferAmt = balanceDue;

    if (amtResult <= 0) {
        logDebug("insufficient funds to do transfer from receipt record");
        return false;
    }

    if (amtResult < balanceDue) {
        transferAmt = amtResult; 
    }
  


  var xferResult = aa.finance.makeFundTransfer(receiptCapId,targetCapId,currentUserID,"","",sysDate,sysDate,"",sysDate,transferAmt,"NA","Fund Transfer","NA","R",null,"","NA","");
  if (xferResult.getSuccess())
       logDebug("Successfully transferred $" +transferAmt + " from " + receiptCapId + " to " + targetCapId);
  else
       logDebug("Error transferring funds " + xferResult.getErrorMessage());
 

    var piresult = aa.finance.getPaymentByCapID(targetCapId,null).getOutput()

    for (ik in piresult)
        {
        var feeSeqArray = new Array();
        var invoiceNbrArray = new Array();
        var feeAllocationArray = new Array();


        var thisPay = piresult[ik];
        var applyAmt = 0;
        var unallocatedAmt = thisPay.getAmountNotAllocated()

        if (unallocatedAmt > 0)
            {

            var invArray = aa.finance.getInvoiceByCapID(targetCapId, null).getOutput()

            for (var invCount in invArray)
                {
                var thisInvoice = invArray[invCount];
                var balDue = thisInvoice.getInvoiceModel().getBalanceDue();
                if (balDue > 0)
                    {
                    feeT = aa.invoice.getFeeItemInvoiceByInvoiceNbr(thisInvoice.getInvNbr()).getOutput();

                    for (targetFeeNum in feeT)
                        {
                        var thisTFee = feeT[targetFeeNum];

                        if (thisTFee.getFee() > unallocatedAmt)
                            applyAmt = unallocatedAmt;
                        else
                            applyAmt = thisTFee.getFee()   // use balance here?

                        unallocatedAmt = unallocatedAmt - applyAmt;

                        feeSeqArray.push(thisTFee.getFeeSeqNbr());
                        invoiceNbrArray.push(thisInvoice.getInvNbr());
                        feeAllocationArray.push(applyAmt);
                        }
                    }
                }

                applyResult = aa.finance.applyPayment(targetCapId,thisPay,feeSeqArray, invoiceNbrArray, feeAllocationArray, "PAYSTAT", "INVSTAT", "123")

                if (applyResult.getSuccess()) {
                    logDebug("Successfully applied payment");
                    return transferAmt;
                }
                    
                else {
                    logDebug( "**ERROR: applying payment to fee (" + thisTFee.getFeeDescription() + "): " + applyResult.getErrorMessage());
                    return false;
                }
                    

            }
    }

}