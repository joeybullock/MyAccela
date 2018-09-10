function updateWorkDesc(newWorkDes) // optional CapId
{
	var itemCap = capId
		if (arguments.length > 1)
			itemCap = arguments[1]; // use cap ID specified in args


		var workDescResult = aa.cap.getCapWorkDesByPK(itemCap);
	var workDesObj;

	if (!workDescResult.getSuccess()) {
		aa.print("**ERROR: Failed to get work description: " + workDescResult.getErrorMessage());
		return false;
	}

	var workDesScriptObj = workDescResult.getOutput();
	if (workDesScriptObj) {
		workDesObj = workDesScriptObj.getCapWorkDesModel();
	} else {
		aa.print("**ERROR: Failed to get workdes Obj: " + workDescResult.getErrorMessage());
		return false;
	}

	workDesObj.setDescription(newWorkDes);
	aa.cap.editCapWorkDes(workDesObj);

	aa.print("Updated Work Description to : " + newWorkDes);

}
