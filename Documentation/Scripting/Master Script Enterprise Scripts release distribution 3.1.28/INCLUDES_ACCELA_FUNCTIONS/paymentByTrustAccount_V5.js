function paymentByTrustAccount(fSeqNbr) //optional: itemCap
  {
	// function  performs the following:
	// retrieve primary trust account on capId 
	// initiates payment from identified trust account for the ammount of the fee associated with fseqNbr
	// if payment successful applies payment in full to fee associated with fseqNbr
	// generates receipt for payment for fee associated with fseqNbr
	// if any of the above fails returns false, otherwise will return true.
	// fee must be invoiced for function to work, use optional capId parameter with addFee() call to ensure fee is invoiced prior to this function being called.
	// 06/08/2011 - Joseph Cipriano - Truepoint Solutions: Made revision to function.  Alter call to pull Primary Trust Account on Cap to use method aa.trustAccount.getPrimaryTrustAccountByCAP().

        feeSeqNbr = fSeqNbr;
	itemCap = capId;
	if (arguments.length == 2) itemCap = arguments[1]; // use cap ID specified in args
	
	// 06/08/2011 - Joseph Cipriano - Truepoint Solutions: Remarked out section on validating if the record has a Licensed Professional.
	/*
	//Make sure there is at least one Licensed Professional on cap.
	capLicenseResult = aa.licenseScript.getLicenseProf(capId);
	if (capLicenseResult.getSuccess())
		{
		lpArray = capLicenseResult.getOutput();
		//Alter condition below. Added condition to also check if the lpArray is null.
		if (lpArray == null || lpArray.length == 0) return false; //no LPs found
		}
	else
		{
		//no LPs found
		return false;
		}
        */

	//get fee details
	//retrieve a list of invoices by capID
	iListResult = aa.finance.getInvoiceByCapID(itemCap,null);
	if (iListResult.getSuccess())
	  {
		iList = iListResult.getOutput();
		invNbr = "";
		feeAmount = "";
		iFound = false;
		
		//find invoice by matching fee sequence numbers with one passed in
		for (iNum in iList)
		  {
			fList = aa.invoice.getFeeItemInvoiceByInvoiceNbr(iList[iNum].getInvNbr()).getOutput()
			for (fNum in fList)
        	  if (fList[fNum].getFeeSeqNbr() == feeSeqNbr)
			    {	
				  invNbr = iList[iNum].getInvNbr();
				  feeAmount = fList[fNum].getFee();
				  iFound = true;
				  logMessage("Invoice Number Found: " + invNbr);
				  logMessage("Fee Amount: " + feeAmount);
				  break;
				}
		  }
		  if (!iFound)
			{
			  logMessage("Invoice not found");
			  return false;
			}
	  }
	else
	  {
		logDebug("Error: could not retrieve invoice list: " + iListResult.getErrorMessage());
		return false;
	  }

	
	//retrieve trust account
	//will likely need more logic here to select correct trust account
	//will select first account found on cap
        var tPAcctResult = aa.trustAccount.getPrimaryTrustAccountByCAP(itemCap);

	if (tPAcctResult.getSuccess())
	  {
		tAccountID = tPAcctResult.getOutput().getAcctID();
		tAcctResult = aa.trustAccount.getTrustAccountByAccountID(tAccountID);
		if (tAcctResult.getSuccess())
		  {
			tAcct = tAcctResult.getOutput();
			if (tAcct.getOverdraft == "Y")
			 {
				logDebug("Overdraft allowed");
				if ((tAcct.getAcctBalance() + tAcct.getOverdraftLimit()) < feeAmount)
				  {
					logDebug("The trust account balance plus overdraft allowance is less than invoiced fee amount.")
					logMessage("Trust Account Balance: " + tAcct.getAcctBalance());
					logDebug("Trust Account Overlimit allowance: " + tAcct.getOverdraftLimit());
					return false;
				  }
			 }	  
			else
			{
				if (tAcct.getOverdraft == "N")
				{
					if (tAcct.getAcctBalance() < feeAmount)
					{
						logDebug("The trust account balance is less than invoiced fee amount.")
						logMessage("Trust Account Balance: " + tAcct.getAcctBalance());
						return false;
					}
				}	
			}
			comment("Trust Account ID: " + tAcct.getAcctID());  
			logDebug("Trust Account Balance: " + tAcct.getAcctBalance());
		  }

	  }
	else
	  {
		logDebug("Error: could not retrieve trust account object: " + tPAcctResult.getErrorMessage());
		return false;
	  }
	  
	//prepare payment
	//create paymentscriptmodel
	p = aa.finance.createPaymentScriptModel();
	p.setAuditDate(aa.date.getCurrentDate());
	p.setAuditStatus("A");
	p.setCapID(itemCap);
	p.setCashierID(p.getAuditID());
	p.setPaymentSeqNbr(p.getPaymentSeqNbr());
	p.setPaymentAmount(feeAmount);
	p.setAmountNotAllocated(feeAmount);
	p.setPaymentChange(0);
	p.setPaymentComment("Trust Account Auto-Deduct: " + tAccountID);
	p.setPaymentDate(aa.date.getCurrentDate());
	p.setPaymentMethod("Trust Account");
	p.setPaymentStatus("Paid");
	p.setAcctID(tAccountID);
 
	//create payment
	presult = aa.finance.makePayment(p);
	if (presult.getSuccess()) 
	  {
		//get additional payment information
		pSeq = presult.getOutput();
		logDebug("Payment successful");
		pReturn = aa.finance.getPaymentByPK(itemCap,pSeq,currentUserID);
		if (pReturn.getSuccess()) 
			{
				pR = pReturn.getOutput();
				logDebug("PaymentSeq: " + pR.getPaymentSeqNbr());
			}
		else
			{
				logDebug("Error retrieving payment, must apply payment manually: " + pReturn.getErrorMessage());
				return false;
			}
		
	  }
	else 
	  {
		logDebug("error making payment: " + presult.getErrorMessage());
		return false;
	  }
	
	//apply payment
	//need to figure out how to get payment script model of resulting payment, and paymentFeeStatus and paymentIvnStatus
	feeSeqNbrArray = new Array() ; 
	feeSeqNbrArray.push(feeSeqNbr);
	
	invNbrArray = new Array();
	invNbrArray.push(invNbr);
	
	feeAllocArray = new Array();
	feeAllocArray.push(feeAmount);

	applyResult = aa.finance.applyPayment(itemCap,pR.getPaymentSeqNbr(),feeAmount,feeSeqNbrArray,invNbrArray,feeAllocArray,aa.date.getCurrentDate(),"Paid","Paid",pR.getCashierID(),null);
		
	if (applyResult.getSuccess()) 
	  {
		//get additional payment information
		apply = applyResult.getOutput();
		logDebug("Apply Payment Successful");
	  }
	else 
	  {
		logDebug("error applying funds: " + applyResult.getErrorMessage());
		return false;
	  }
	
	
	//generate receipt
	receiptResult = aa.finance.generateReceipt(itemCap,aa.date.getCurrentDate(),pR.getPaymentSeqNbr(),pR.getCashierID(),null);

	if (receiptResult.getSuccess())
	  {
		receipt = receiptResult.getOutput();
		logDebug("Receipt successfully created: ");// + receipt.getReceiptNbr());
	  }
	else 
	  {
		logDebug("error generating receipt: " + receiptResult.getErrorMessage());
		return false;
	  }
	   
	 //everything committed successfully
	 return true;
  }