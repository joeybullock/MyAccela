function resultInspection(inspType, inspStatus, resultDate, resultComment) //optional capId
{
	var itemCap = capId
		if (arguments.length > 4)
			itemCap = arguments[4]; // use cap ID specified in args

		var foundID;
	var inspResultObj = aa.inspection.getInspections(itemCap);
	if (inspResultObj.getSuccess()) {
		var inspList = inspResultObj.getOutput();
		for (xx in inspList)
			if (String(inspType).equals(inspList[xx].getInspectionType()) && inspList[xx].getInspectionStatus().toUpperCase().equals("SCHEDULED"))
				foundID = inspList[xx].getIdNumber();
	}

	if (foundID) {
		resultResult = aa.inspection.resultInspection(itemCap, foundID, inspStatus, resultDate, resultComment, currentUserID)

			if (resultResult.getSuccess()) {
				logDebug("Successfully resulted inspection: " + inspType + " to Status: " + inspStatus)
			} else {
				logDebug("**WARNING could not result inspection : " + inspType + ", " + resultResult.getErrorMessage());
			}
	} else {
		logDebug("Could not result inspection : " + inspType + ", not scheduled");
	}

}
