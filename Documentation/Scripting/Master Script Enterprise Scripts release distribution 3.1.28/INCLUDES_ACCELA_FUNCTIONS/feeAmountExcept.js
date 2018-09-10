
//Parameter 1 = CapId, Parameter 2 to n = Fee Code to ignore
function feeAmountExcept(checkCapId) 
	{
   	var checkStatus = false;
	var exceptArray = new Array(); 
	//get optional arguments 
	if (arguments.length > 1)
		{
		checkStatus = true;
		for (var i=1; i<arguments.length; i++)
			exceptArray.push(arguments[i]);
		}
        
	var feeTotal = 0;
	var feeResult=aa.fee.getFeeItems(checkCapId);
	if (feeResult.getSuccess())
		{ var feeObjArr = feeResult.getOutput(); }
	else
		{ logDebug( "**ERROR: getting fee items: " + capContResult.getErrorMessage()); return false }
	
	for (ff in feeObjArr)
		if ( !checkStatus || !exists(feeObjArr[ff].getFeeCod(),exceptArray) )
			feeTotal+=feeObjArr[ff].getFee()
			
	return feeTotal;
	}

