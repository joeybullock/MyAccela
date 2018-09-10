function taskStatus(wfstr) // optional process name and capID
{
	var useProcess = false;
	var processName = "";
	var itemCap = capId;
	if (arguments.length >= 2) {
		processName = arguments[1]; // subprocess
		if (processName)
			useProcess = true;
	}

	if (arguments.length == 3)
		itemCap = arguments[2]; // use cap ID specified in args


	var workflowResult = aa.workflow.getTaskItems(itemCap, wfstr, processName, null, null, null);
	if (workflowResult.getSuccess())
		var wfObj = workflowResult.getOutput();
	else {
		logMessage("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage());
		return false;
	}

	for (i in wfObj) {
		var fTask = wfObj[i];
		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase()) && (!useProcess || fTask.getProcessCode().equals(processName)))
			return fTask.getDisposition()
	}
}