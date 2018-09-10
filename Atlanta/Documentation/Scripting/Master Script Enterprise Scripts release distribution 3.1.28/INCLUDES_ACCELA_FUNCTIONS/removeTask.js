function removeTask(targetCapId, removeTaskName) // optional process name
{
	var useProcess = false;
	var processName = "";
	if (arguments.length == 3) {
		processName = arguments[2]; // subprocess
		useProcess = true;
	}

	//
	// Get the target Task
	//
	var workflowResult = aa.workflow.getTaskItems(targetCapId, removeTaskName, processName, null, null, null);
	if (workflowResult.getSuccess())
		var wfObj = workflowResult.getOutput();
	else {
		logDebug("**WARNING: Failed to get workflow object: " + workflowResult.getErrorMessage());
		return false;
	}

	var tTask = null;

	for (i in wfObj) {
		var fTask = wfObj[i];
		if (fTask.getTaskDescription().toUpperCase().equals(removeTaskName.toUpperCase()) && (!useProcess || fTask.getProcessCode().toUpperCase().equals(processName.toUpperCase()))) {
			tTask = wfObj[i];
		}
	}

	if (!tTask) {
		logDebug("**WARNING: Task to remove not found: " + removeTaskName);
		return false;
	}

	var result = aa.workflow.removeTask(tTask)

		if (!result.getSuccess()) {
			logDebug("**WARNING: error removing task " + result.getErrorMessage());
			return false;
		} else {
			logDebug("Removed task " + tTask.getTaskDescription());
		}

}
