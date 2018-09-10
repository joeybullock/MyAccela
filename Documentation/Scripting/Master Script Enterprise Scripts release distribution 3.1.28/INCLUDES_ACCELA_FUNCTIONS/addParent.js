function addParent(parentAppNum)
//
// adds the current application to the parent
//
	{
	if (typeof(parentAppNum) != "object")  // is this one an object or string?
		{
		var getCapResult = aa.cap.getCapID(parentAppNum);
		if (getCapResult.getSuccess())
			{
			var parentId = getCapResult.getOutput();
			}
		else
			{ logDebug( "**ERROR: getting parent cap id (" + parentAppNum + "): " + getCapResult.getErrorMessage());
				return false;}
		}
	else
		{
		parentId = parentAppNum;
		}

	var linkResult = aa.cap.createAppHierarchy(parentId, capId);
	if (linkResult.getSuccess())
		logDebug("Successfully linked to Parent Application : " + parentAppNum);
	else
		logDebug( "**ERROR: linking to parent application parent cap id (" + parentAppNum + "): " + linkResult.getErrorMessage());

	}

