function insertTask(sourceTaskName,newTaskName,insertTaskType) 
	{
	itemCap = capId;
	if (arguments.length > 3)
		itemCap = arguments[3]; // use cap ID specified in args

	var sTask;
	var tTask;
	//copy as next task 
	var insertNType ="N";
	//copy as parrallel task
	insertPType ="P";
	
	//get the task by the task path
	var taskResult1 = aa.workflow.getTask(capId,sourceTaskName);
	if (taskResult1.getSuccess())
	{
		tTask = taskResult1.getOutput();
		aa.print("get task successful : task name = " + tTask.getTaskDescription() + "; Process name = " + tTask.getProcessCode());
	}
	else
		{ aa.print("ERROR: Failed to get task! Path = " + sourceTaskName +";" + taskResult1.getErrorMessage()); }
		

	//change the task name
	tTask.setTaskDescription(newTaskName);
	
	var taskResult = aa.workflow.insertTask(tTask,insertTaskType);
	if (taskResult.getSuccess())
	{
		var processId = tTask.getProcessID();
		var stepNum =tTask.getStepNumber();
		var taskResult1 = aa.workflow.getTask(capId,stepNum,processId);
			
		if (taskResult1.getSuccess())
		{
			tTask = taskResult1.getOutput();
			aa.print("insert task successful : inserted task name = " + tTask.getTaskDescription() + "; Process name = " + tTask.getProcessCode());
		}
		else
			{ aa.print("ERROR: Failed to get task! Path = " + taskPath +";" + taskResult1.getErrorMessage()); return false; }
		
	}
	else
		{ aa.print("ERROR: Failed to insert task! Path = " + taskPath +";" + taskResult.getErrorMessage()); return false; }
		
	
	return tTask;  // returns task item
}