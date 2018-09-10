function isTaskStatus(wfstr, wfstat) // optional process name
{
	var useProcess = false;
	var processName = "";
	if (arguments.length > 2) {
		processName = arguments[2]; // subprocess
		useProcess = true;
	}

	var workflowResult = aa.workflow.getTaskItems(capId, wfstr, processName, null, wfstat, null);
	if (workflowResult.getSuccess())
		var wfObj = workflowResult.getOutput();
	else {
		logMessage("**ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage());
		return false;
	}

	for (i in wfObj) {
		fTask = wfObj[i];
		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase()) && (!useProcess || fTask.getProcessCode().equals(processName)))
			if (fTask.getDisposition() != null) {
				if (fTask.getDisposition().toUpperCase().equals(wfstat.toUpperCase()))
					return true;
				else
					return false;
			}
	}
	return false;
}
