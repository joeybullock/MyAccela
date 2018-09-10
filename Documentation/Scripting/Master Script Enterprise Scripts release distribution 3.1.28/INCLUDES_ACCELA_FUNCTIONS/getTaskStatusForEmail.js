function getTaskStatusForEmail(stask) {
	// returns a string of task statuses for a workflow group
	var returnStr = ""
		var taskResult = aa.workflow.getTaskItems(capId, null, stask, "Y", null, null);
	if (taskResult.getSuccess()) {
		var taskArr = taskResult.getOutput();
	} else {
		logDebug("**ERROR: getting tasks : " + taskResult.getErrorMessage());
		return false
	}

	for (xx in taskArr)
		if (taskArr[xx].getProcessCode().equals(stask) && taskArr[xx].getCompleteFlag().equals("Y")) {
			returnStr += "Task Name: " + taskArr[xx].getTaskDescription() + "\n";
			returnStr += "Task Status: " + taskArr[xx].getDisposition() + "\n";
			if (taskArr[xx].getDispositionComment() != null)
				returnStr += "Task Comments: " + taskArr[xx].getDispositionComment() + "\n";
			returnStr += "\n";
		}
	logDebug(returnStr);
	return returnStr;
}