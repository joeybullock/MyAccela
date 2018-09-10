function copySchedInspections(pFromCapId, pToCapId)
	{
	//Copies all scheduled inspections from pFromCapId to pToCapId
	//If pToCapId is null, copies to current CAP
	//07SSP-00037/SP5017
	//
	if (pToCapId==null)
		var vToCapId = capId;
	else
		var vToCapId = pToCapId;
		
	var inspResultObj = aa.inspection.getInspections(pFromCapId);
	
	if (!inspResultObj.getSuccess())
		{
		logMessage("**ERROR: Failed to get inspections: " + inspResultObj.getErrorMessage()); 
		return false;
		}
		
	var inspCount = 0;
	var schedRes;
	var inspector;
	var inspDate;
	var inspTime;
	var inspType;
	var inspComment;	
	
	var inspList = inspResultObj.getOutput();
	for (xx in inspList)
		{
		if ("Insp Scheduled"==inspList[xx].getDocumentDescription())
			{
			inspector = inspList[xx].getInspector();
			inspDate = inspList[xx].getScheduledDate();
			inspTime = inspList[xx].getScheduledTime();
			inspType = inspList[xx].getInspectionType();
			inspComment = inspList[xx].getInspectionComments();
			schedRes = aa.inspection.scheduleInspection(vToCapId, inspector, inspDate, inspTime, inspType, inspComment);
			if (schedRes.getSuccess())
				{
				logDebug("Copied scheduled inspection from "+pFromCapId.getCustomID()+" to "+vToCapId.getCustomID());
				inspCount++;
				}
			else
				logDebug( "**ERROR: copying scheduling inspection (" + inspType + "): " + schedRes.getErrorMessage());
			}
		}
	return inspCount;	
	}


