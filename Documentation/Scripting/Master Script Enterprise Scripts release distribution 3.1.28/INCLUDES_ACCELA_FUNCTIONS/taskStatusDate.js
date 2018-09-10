/*
DQ 09/03/2009 - Added Check to ensure Task status date is not null prior to getting status date
Function will return false on fail
*/
function taskStatusDate(wfstr) // optional process name, capId
{
	var itemCap = capId;
	if (arguments.length == 3)
		itemCap = arguments[2]; // use cap ID specified in args

	var useProcess = false;
	var processName = "";
	if (arguments.length > 1 && arguments[1] != null) {
		processName = arguments[1]; // subprocess
		useProcess = true;
	}

	var workflowResult = aa.workflow.getTaskItems(itemCap, wfstr, processName, null, null, null);
	if (workflowResult.getSuccess())
		var wfObj = workflowResult.getOutput();
	else {
		logMessage("**ERROR: Failed to get workflow object: " + wfObj.getErrorMessage());
		return false;
	}

	for (i in wfObj) {
		var fTask = wfObj[i];
		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase()) && (!useProcess || fTask.getProcessCode().equals(processName)))
			if (fTask.getStatusDate() != null)
				return "" + (fTask.getStatusDate().getMonth() + 1) + "/" + fTask.getStatusDate().getDate() + "/" + (parseInt(fTask.getStatusDate().getYear()) + 1900);
			else {
				logMessage("**ERROR: NULL workflow task " + fTask.getTaskDescription() + " status date. ");
				return false;
			}
	}
}
