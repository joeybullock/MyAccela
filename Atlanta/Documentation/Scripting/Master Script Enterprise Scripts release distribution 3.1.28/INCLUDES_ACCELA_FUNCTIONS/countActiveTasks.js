function countActiveTasks(processName) {
	// counts the number of active tasks on a given process
	var numOpen = 0;

	var countResult = aa.workflow.getTaskCount(capId, processName, "Y");
	if (countResult.getSuccess())
		numOpen = countResult.getOutput().intValue();
	else {
		logMessage("**ERROR: Failed to get task count: " + s_capResult.getErrorMessage());
		return false;
	}

	return numOpen;
}
