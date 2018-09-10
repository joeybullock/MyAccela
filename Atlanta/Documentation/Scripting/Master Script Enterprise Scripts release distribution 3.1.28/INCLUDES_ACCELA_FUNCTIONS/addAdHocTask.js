 function addAdHocTask(adHocProcess, adHocTask, adHocNote)
{
//adHocProcess must be same as one defined in R1SERVER_CONSTANT
//adHocTask must be same as Task Name defined in AdHoc Process
//adHocNote can be variable
//Optional 4 parameters = Assigned to User ID must match an AA user
//Optional 5 parameters = CapID
	var thisCap = capId;
	var thisUser = currentUserID;
	if(arguments.length > 3)
		thisUser = arguments[3]
	if(arguments.length > 4)
		thisCap = arguments[4];
	var userObj = aa.person.getUser(thisUser);
	if (!userObj.getSuccess())
	{
		logDebug("Could not find user to assign to");
		return false;
	}
	var taskObj = aa.workflow.getTasks(thisCap).getOutput()[0].getTaskItem()
	taskObj.setProcessCode(adHocProcess);
	taskObj.setTaskDescription(adHocTask);
	taskObj.setDispositionNote(adHocNote);
	taskObj.setProcessID(0);
	taskObj.setAssignmentDate(aa.util.now());
	taskObj.setDueDate(aa.util.now());
	taskObj.setAssignedUser(userObj.getOutput());
	wf = aa.proxyInvoker.newInstance("com.accela.aa.workflow.workflow.WorkflowBusiness").getOutput();
	wf.createAdHocTaskItem(taskObj);
	return true;
}

