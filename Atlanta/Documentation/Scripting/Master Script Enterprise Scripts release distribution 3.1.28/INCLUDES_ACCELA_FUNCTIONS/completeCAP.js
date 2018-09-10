function completeCAP(userId) // option CapId
{
	var itemCap = capId
	if (arguments.length > 1) itemCap = arguments[1]; // use cap ID specified in args

	var cdScriptObjResult = aa.cap.getCapDetail(itemCap);
	if (!cdScriptObjResult.getSuccess())
		{ 	logDebug("**ERROR: No cap detail script object : " + cdScriptObjResult.getErrorMessage());
			return false; }
	
	var cdScriptObj = cdScriptObjResult.getOutput();

	if (!cdScriptObj)
		{ 	logDebug("**ERROR: No cap detail script object") ;
			return false; }
		
	cd = cdScriptObj.getCapDetailModel();
	
	iNameResult  = aa.person.getUser(userId);

	if (!iNameResult.getSuccess())
		{ 	logDebug("**ERROR retrieving  user model " + userId + " : " + iNameResult.getErrorMessage()) ;
			return false ; }
	
	iName = iNameResult.getOutput();

	cd.setCompleteDept(iName.getDeptOfUser());
	cd.setCompleteStaff(userId);
	cdScriptObj.setCompleteDate(sysDate);
		
	cdWrite = aa.cap.editCapDetail(cd)
	
	if (cdWrite.getSuccess())
	{ 	
		logDebug("Set CAP *Completed by Staff* to " + userId) + "\nSet CAP *Completed by Dept* " + iName.getDeptOfUser() + "\nSet CAP *Completed Date* " + sysDate.toString(); 
	}
	else
	{ 	
		logDebug("**ERROR writing capdetail : " + cdWrite.getErrorMessage()) ;
		return false ; 
	}
}