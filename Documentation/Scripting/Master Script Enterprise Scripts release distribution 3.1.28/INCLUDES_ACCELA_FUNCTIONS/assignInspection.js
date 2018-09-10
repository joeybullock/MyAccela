function assignInspection(iNumber, iName) {
	// optional capId
	// updates the inspection and assigns to a new user
	// requires the inspection id and the user name
	// V2 8/3/2011.  If user name not found, looks for the department instead
	//

	var itemCap = capId
		if (arguments.length > 2)
			itemCap = arguments[2]; // use cap ID specified in args

		iObjResult = aa.inspection.getInspection(itemCap, iNumber);
	if (!iObjResult.getSuccess()) {
		logDebug("**WARNING retrieving inspection " + iNumber + " : " + iObjResult.getErrorMessage());
		return false;
	}

	iObj = iObjResult.getOutput();

	iInspector = aa.person.getUser(iName).getOutput();

	if (!iInspector) // must be a department name?
	{
		var dpt = aa.people.getDepartmentList(null).getOutput();
		for (var thisdpt in dpt) {
			var m = dpt[thisdpt]
				if (iName.equals(m.getDeptName())) {
					iNameResult = aa.person.getUser(null, null, null, null, m.getAgencyCode(), m.getBureauCode(), m.getDivisionCode(), m.getSectionCode(), m.getGroupCode(), m.getOfficeCode());

					if (!iNameResult.getSuccess()) {
						logDebug("**WARNING retrieving department user model " + iName + " : " + iNameResult.getErrorMessage());
						return false;
					}

					iInspector = iNameResult.getOutput();
				}
		}
	}

	if (!iInspector) {
		logDebug("**WARNING could not find inspector or department: " + iName + ", no assignment was made");
		return false;
	}

	logDebug("assigning inspection " + iNumber + " to " + iName);

	iObj.setInspector(iInspector);

	if (iObj.getScheduledDate() == null) {
		iObj.setScheduledDate(sysDate);
	}

	aa.inspection.editInspection(iObj)
}
