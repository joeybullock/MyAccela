function lookupFeesByValuationSlidingScale(stdChoiceEntry,stdChoiceValue,capval) // optional arg number 
	{
	var valNumber = 2;
	if (arguments.length == 4) valNumber = (arguments[3] + 1);

	var saveVal ; 
	var lookupStr = lookup(stdChoiceEntry,stdChoiceValue);
	
	if (lookupStr)
		{
		workArr = lookupStr.split("^");
		for (var i in workArr)
			{
                        aa.print(workArr[i]);
                        
                        
			workVals = workArr[i].split("|");
			if (workVals[0] > capval) 
				return saveVal;
			else
				if (valNumber == 2)
					saveVal = workVals[valNumber];
				else
					{
					var divisor = workVals[1];
					saveVal = parseInt((capval - workVals[0])/divisor);
					if ((capval - workVals[0]) % divisor > 0) saveVal++;
					saveVal = saveVal * workVals[valNumber];
					}
			}
		}
	return saveVal;
	}

