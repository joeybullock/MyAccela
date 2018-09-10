function inspCancelAll()
	{
	var isCancelled = false;
	var inspResults = aa.inspection.getInspections(capId);
	if (inspResults.getSuccess())
		{
		var inspAll = inspResults.getOutput();
		var inspectionId;
		var cancelResult;
		for (ii in inspAll)
			{
			if (inspAll[ii].getDocumentDescription().equals("Insp Scheduled") && inspAll[ii].getAuditStatus().equals("A"))
				{
				inspectionId = inspAll[ii].getIdNumber();		// Inspection identifier	
				cancelResult = aa.inspection.cancelInspection(capId,inspectionId);
				if (cancelResult.getSuccess())
					{
					logMessage("Cancelling inspection: " + inspAll[ii].getInspectionType());
					isCancelled = true;
					}
				else
					logMessage("**ERROR","**ERROR: Cannot cancel inspection: "+inspAll[ii].getInspectionType()+", "+cancelResult.getErrorMessage());
				}
		  }
		}
	else
		logMessage("**ERROR: getting inspections: " + inspResults.getErrorMessage());
	
	return isCancelled;
	}

