function insertSubProcess(taskName, process, completeReqd) {

	var itemCap = capId;
	var theTask = null;

	if (arguments.length > 3)
		itemCap = arguments[3]; // use cap ID specified in args

	var workflowResult = aa.workflow.getTaskItems(itemCap, taskName, null, null, null, null);
	if (workflowResult.getSuccess())
		wfObj = workflowResult.getOutput();
	else {
		logDebug("**ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage());
		return false;
	}

	for (var i in wfObj)
		if (taskName.toUpperCase().equals(wfObj[i].getTaskDescription().toUpperCase()))
			theTask = wfObj[i];

	if (theTask) {
		var result = aa.workflow.insertSubProcess(theTask, process, completeReqd)
			if (!result.getSuccess()) {
				logDebug("error " + result.getErrorMessage());
				return false;
			}

			logDebug("attached subprocess " + process + " to " + taskName);
		return true;
	} else {
		logDebug("couldn't find task " + taskName);
		return false;
	}
}