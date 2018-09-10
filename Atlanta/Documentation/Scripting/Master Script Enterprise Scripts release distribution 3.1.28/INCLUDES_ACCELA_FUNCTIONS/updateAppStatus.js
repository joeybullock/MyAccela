function updateAppStatus(stat,cmt) // optional cap id
{
	var itemCap = capId;
	if (arguments.length == 3) 
		itemCap = arguments[2]; // use cap ID specified in args

	var updateStatusResult = aa.cap.updateAppStatus(itemCap, "APPLICATION", stat, sysDate, cmt, systemUserObj);
	if (updateStatusResult.getSuccess())
		logDebug("Updated application status to " + stat + " successfully.");
	else
		logDebug("**ERROR: application status update to " + stat + " was unsuccessful.  The reason is "  + updateStatusResult.getErrorType() + ":" + updateStatusResult.getErrorMessage());
}

