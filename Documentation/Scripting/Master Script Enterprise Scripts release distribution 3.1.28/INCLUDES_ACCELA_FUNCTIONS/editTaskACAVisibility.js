
function editTaskACAVisibility(wfstr,visibleTask,visibleComment,restrictRole) // optional process name
	{
	// restrictRole is string of five binary digits
	// representing, 0: all aca users, 1: creator, 2:LP, 3:Contact, 4:Owner
	// example: 01011 = creator, contact, owner have access
	// example: 11111 = everybody
	// example: 00001 = only the owner
	var useProcess = false;
	var processName = "";
	if (arguments.length == 4) 
		{
		processName = arguments[3]; // subprocess
		useProcess = true;
		}

	var workflowResult = aa.workflow.getTasks(capId);
 	if (workflowResult.getSuccess())
  	 	var wfObj = workflowResult.getOutput();
  	else
  	  	{ logMessage("**ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage()); return false; }
	
	for (i in wfObj)
		{
   		fTask = wfObj[i];
  		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase())  && (!useProcess || fTask.getProcessCode().equals(processName)))
			{
			var fTaskModel = wfObj[i].getTaskItem();
			fTaskModel.setIsRestrictView4ACA(visibleComment ? "Y" : "N");
			fTaskModel.setDisplayInACA(visibleTask ? "Y" : "N");
			fTaskModel.setRestrictRole(restrictRole + "00000");
			//var tResult = aa.workflow.adjustTaskWithNoAudit(fTaskModel);  // doesn't work?   WHY?!?
			var tResult = aa.workflow.editTask(fTaskModel,currentUserID);  // works but adds an audit history.
			if (tResult.getSuccess())
				logDebug("Set Workflow visible flags: " + visibleTask + " , " + visibleComment);
		  	else
	  	  		{ logMessage("**ERROR: Failed to update task, comment visible flags on workflow task: " + tResult.getErrorMessage()); return false; }
			}			
		}
	}