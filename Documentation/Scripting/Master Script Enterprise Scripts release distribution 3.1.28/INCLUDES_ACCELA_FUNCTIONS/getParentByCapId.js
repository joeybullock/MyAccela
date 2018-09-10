function getParentByCapId(itemCap) 
	{
	// returns the capId object of the parent.  Assumes only one parent!
	//
	getCapResult = aa.cap.getProjectParents(itemCap,1);
	if (getCapResult.getSuccess())
		{
		parentArray = getCapResult.getOutput();
		if (parentArray.length)
			return parentArray[0].getCapID();
		else
			{
			logDebug( "**WARNING: GetParent found no project parent for this application");
			return false;
			}
		}
	else
		{ 
		logDebug( "**WARNING: getting project parents:  " + getCapResult.getErrorMessage());
		return false;
		}
	}