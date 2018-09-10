function setTask(wfstr, isOpen, isComplete) // optional process name isOpen, isComplete take 'Y' or 'N'
{
	var useProcess = false;
	var processName = "";
	if (arguments.length == 4) {
		processName = arguments[3]; // subprocess
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
			var completeFlag = fTask.getCompleteFlag();

			if (useProcess)
				aa.workflow.adjustTask(capId, stepnumber, processID, isOpen, isComplete, null, null);
			else
				aa.workflow.adjustTask(capId, stepnumber, isOpen, isComplete, null, null);

				logDebug("set Workflow Task: " + wfstr);
		}
	}
}
