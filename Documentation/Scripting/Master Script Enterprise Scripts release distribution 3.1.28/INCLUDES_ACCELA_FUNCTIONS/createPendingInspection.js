
function createPendingInspection(iGroup,iType) // optional Cap ID
	{
	var itemCap = capId;
	if (arguments.length == 3) itemCap = arguments[2]; // use cap ID specified in args

	var itmResult = aa.inspection.getInspectionType(iGroup,iType)
	
	if (!itmResult.getSuccess())
		{
		logDebug("**WARNING error retrieving inspection types: " + itmResult.getErrorMessage);
		return false;
		}

	var itmArray = itmResult.getOutput();
	
	if (!itmArray)
		{
		logDebug("**WARNING could not find any matches for inspection group " + iGroup + " and type " + iType);
		return false;
		}

	var itmSeq = null;
	
	for (thisItm in itmArray)
		{
		var it = itmArray[thisItm];
		if (it.getGroupCode().toUpperCase().equals(iGroup.toUpperCase()) && it.getType().toUpperCase().equals(iType.toUpperCase()))
			itmSeq = it.getSequenceNumber();
		}

	if (!itmSeq)
		{
		logDebug("**WARNING could not find an exact match for inspection group " + iGroup + " and type " + iType);
		return false;
		}
		
	var inspModel = aa.inspection.getInspectionScriptModel().getOutput().getInspection();
	
	var activityModel = inspModel.getActivity();
	activityModel.setInspSequenceNumber(itmSeq);
	activityModel.setCapIDModel(itemCap);

	pendingResult = aa.inspection.pendingInspection(inspModel)

	if (pendingResult.getSuccess())
		{
		logDebug("Successfully created pending inspection group " + iGroup + " and type " + iType);
		return true;
		}
	else
		{
		logDebug("**WARNING could not create pending inspection group " + iGroup + " and type " + iType + " Message: " + pendingResult.getErrorMessage());
		return false;
		}
	
}
	
	

