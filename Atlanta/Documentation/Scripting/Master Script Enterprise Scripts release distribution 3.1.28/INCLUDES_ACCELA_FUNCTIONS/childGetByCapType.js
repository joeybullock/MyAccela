function childGetByCapType(pCapType, pParentCapId) 
	{
	// Returns capId object of first child of pParentCapId whose cap type matches pCapType parameter
	// Wildcard * may be used in pCapType, e.g. "Building/Commercial/*/*"
	// Optional 3rd parameter pChildCapIdSkip: capId of child to skip
	// 06SSP-00219.C61201
  //
	if (pParentCapId!=null) //use cap in parameter 
		var vCapId = pParentCapId;
	else // use current cap
		var vCapId = capId;
		
	if (arguments.length>2)
		var childCapIdSkip = arguments[2];
	else
		var childCapIdSkip = null;
		
	var typeArray = pCapType.split("/");
	if (typeArray.length != 4)
		logDebug("**ERROR in childGetByCapType function parameter.  The following cap type parameter is incorrectly formatted: " + pCapType);
		
	var getCapResult = aa.cap.getChildByMasterID(vCapId);
	if (getCapResult.getSuccess())
		{
		var childArray = getCapResult.getOutput();
		if (childArray.length)
			{
			var childCapId;
			var capTypeStr = "";
			var childTypeArray;
			var isMatch;
			for (xx in childArray)
				{
				childCapId = childArray[xx].getCapID();
				if (childCapIdSkip!=null && childCapIdSkip.getCustomID().equals(childCapId.getCustomID())) //skip over this child
					continue;
				
				capTypeStr = aa.cap.getCap(childCapId).getOutput().getCapType().toString();	// Convert cap type to string ("Building/A/B/C")
				childTypeArray = capTypeStr.split("/");
				isMatch = true;
				for (yy in childTypeArray) //looking for matching cap type
					{
					if (!typeArray[yy].equals(childTypeArray[yy]) && !typeArray[yy].equals("*"))
						{
						isMatch = false;
						break;
						}
					}
				if (isMatch)
					return childCapId;
				}
			}
		else
			logDebug( "**WARNING: childGetByCapType function found no children");	
			
		return false;
		}
	else
		logDebug( "**WARNING: childGetByCapType function found no children: " + getCapResult.getErrorMessage());
	}
	
