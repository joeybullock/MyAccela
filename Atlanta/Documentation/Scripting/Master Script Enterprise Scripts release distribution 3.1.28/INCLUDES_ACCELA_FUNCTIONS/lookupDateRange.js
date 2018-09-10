function lookupDateRange(stdChoiceEntry,dateValue) // optional val number 
	{
	var valNumber = 1;
	if (arguments.length == 3) valNumber = arguments[2];

	var compDate = new Date(dateValue);
	var domArr
	for (var count=1; count <= 9999; count++)  // Must be sequential from 01 up to 9999
		{
		var countstr = "0000" + count;
		var countstr = String(countstr).substring(countstr.length,countstr.length - 4);
		var bizDomScriptResult = aa.bizDomain.getBizDomainByValue(stdChoiceEntry,countstr);
	   	
	   	if (bizDomScriptResult.getSuccess())
	   		{
			var bizDomScriptObj = bizDomScriptResult.getOutput();
			var domVal = bizDomScriptObj.getDescription();
			if (bizDomScriptObj.getAuditStatus() != 'I')
				{
				var domOld = domArr;
				var domArr = domVal.split("\\^")
				var domDate = new Date(domArr[0])
				if (domDate >= compDate)     //  found the next tier, use the last value
					if (domOld)
						return domOld[valNumber];
					else
						break;
				}					
			}
		else
			if (domArr)
				return domArr[valNumber];
			else
				break;
		}
	}	
