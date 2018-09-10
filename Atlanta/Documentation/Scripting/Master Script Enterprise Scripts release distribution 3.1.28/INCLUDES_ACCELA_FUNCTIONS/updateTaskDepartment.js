function updateTaskDepartment(wfstr, wfDepartment) // optional process name
{
	// Update the task assignment department
	//
	var useProcess = false;
	var processName = "";
	if (arguments.length == 3) {
		processName = arguments[2]; // subprocess
		useProcess = true;
	}

	var workflowResult = aa.workflow.getTaskItems(capId, wfstr, processName, null, null, null);
	if (workflowResult.getSuccess())
		wfObj = workflowResult.getOutput();
	else {
		logDebug("**ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage());
		return false;
	}

	for (var i in wfObj) {
		fTask = wfObj[i];
		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase()) && (!useProcess || fTask.getProcessCode().equals(processName))) {
			if (wfDepartment) {
				var taskUserObj = fTask.getTaskItem().getAssignedUser()
					taskUserObj.setDeptOfUser(wfDepartment);

				fTask.setAssignedUser(taskUserObj);
				var taskItem = fTask.getTaskItem();

				var adjustResult = aa.workflow.assignTask(taskItem);
				if (adjustResult.getSuccess())
					logDebug("Updated Workflow Task : " + wfstr + " Department Set to " + wfDepartment);
				else
					logDebug("Error updating wfTask : " + adjustResult.getErrorMessage());
			} else
				logDebug("Couldn't update Department.  Invalid department : " + wfDepartment);
		}
	}
}
