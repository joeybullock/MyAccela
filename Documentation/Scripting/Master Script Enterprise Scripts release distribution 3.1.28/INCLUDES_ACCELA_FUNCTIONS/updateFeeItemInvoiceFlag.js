function updateFeeItemInvoiceFlag(feeSeq,finvoice)
{
	if(feeSeq == null)
		return;
	if(publicUser && !cap.isCompleteCap())
	{
		var feeItemScript = aa.finance.getFeeItemByPK(capId,feeSeq);
		if(feeItemScript.getSuccess)
		{
			var feeItem = feeItemScript.getOutput().getF4FeeItem();
			feeItem.setAutoInvoiceFlag(finvoice);
			aa.finance.editFeeItem(feeItem);
		}
	}
}
