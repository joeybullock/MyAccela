function activeTasksCheck() {

	var workflowResult = aa.workflow.getTasks(capId);
	if (workflowResult.getSuccess())
		wfObj = workflowResult.getOutput();
	else {
		logDebug("**ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage());
		return false;
	}

	for (i in wfObj) {
		fTask = wfObj[i];
		if (fTask.getActiveFlag().equals("Y"))
			return true;
	}

	return false;
}
