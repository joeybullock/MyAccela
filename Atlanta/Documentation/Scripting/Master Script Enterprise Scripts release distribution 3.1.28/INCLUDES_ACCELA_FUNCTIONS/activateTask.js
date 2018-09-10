function activateTask(wfstr) // optional process name
{
	var useProcess = false;
	var processName = "";
	if (arguments.length == 2) {
		processName = arguments[1]; // subprocess
		useProcess = true;
	}

	var workflowResult = aa.workflow.getTaskItems(capId, wfstr, processName, null, null, null);
	if (workflowResult.getSuccess())
		var wfObj = workflowResult.getOutput();
	else {
		logMessage("**ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage());
		return false;
	}

	for (i in wfObj) {
		var fTask = wfObj[i];
		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase()) && (!useProcess || fTask.getProcessCode().equals(processName))) {
			var stepnumber = fTask.getStepNumber();
			var processID = fTask.getProcessID();

			if (useProcess) {
				aa.workflow.adjustTask(capId, stepnumber, processID, "Y", "N", null, null)
			} else {
				aa.workflow.adjustTask(capId, stepnumber, "Y", "N", null, null)
			}
			logMessage("Activating Workflow Task: " + wfstr);
			logDebug("Activating Workflow Task: " + wfstr);
		}
	}
}
