function assignTask(wfstr,username) // optional process name
	{
	// Assigns the task to a user.  No audit.
	//
	var useProcess = false;
	var processName = "";
	if (arguments.length == 3) 
		{
		processName = arguments[2]; // subprocess
		useProcess = true;
		}
		
	var taskUserResult = aa.person.getUser(username);
	if (taskUserResult.getSuccess())
		taskUserObj = taskUserResult.getOutput();  //  User Object
	else
		{ logMessage("**ERROR: Failed to get user object: " + taskUserResult.getErrorMessage()); return false; }
		
	var workflowResult = aa.workflow.getTaskItems(capId, wfstr, processName, null, null, null);
 	if (workflowResult.getSuccess())
  	 	var wfObj = workflowResult.getOutput();
  	else
  	  	{ logMessage("**ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage()); return false; }
	
	for (i in wfObj)
		{
   		var fTask = wfObj[i];
 		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase())  && (!useProcess || fTask.getProcessCode().equals(processName)))
			{
			fTask.setAssignedUser(taskUserObj);
			var taskItem = fTask.getTaskItem();
			var adjustResult = aa.workflow.assignTask(taskItem);
			
			logMessage("Assigned Workflow Task: " + wfstr + " to " + username);
			logDebug("Assigned Workflow Task: " + wfstr + " to " + username);
			}			
		}
	}

