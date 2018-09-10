function getLastScheduledInspector(insp2Check)
	// function getLastInspector: returns the inspector ID (string) of the last inspector that is assigned to the inspection.
	//
	{
	var inspResultObj = aa.inspection.getInspections(capId);
	if (inspResultObj.getSuccess())
		{
		inspList = inspResultObj.getOutput();

		inspList.sort(compareInspDateDesc)
		for (xx in inspList)
			if (String(insp2Check).equals(inspList[xx].getInspectionType()) && inspList[xx].getInspectionStatus().equals("Scheduled"))
				{
				// have to re-grab the user since the id won't show up in this object.
				inspUserObj = aa.person.getUser(inspList[xx].getInspector().getFirstName(),inspList[xx].getInspector().getMiddleName(),inspList[xx].getInspector().getLastName()).getOutput();
				return inspUserObj.getUserID();
				}
		}
	return null;
	}

