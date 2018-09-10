function addTask(sourceTaskName, newTaskName, insertTaskType) {

	// insertTaskType needs to be "N" or "P" for "Next" or "Parallel"

	var itemCap = capId;
	if (arguments.length > 3)
		itemCap = arguments[3]; // use cap ID specified in args


	if (!insertTaskType.toUpperCase().equals("P") && !insertTaskType.toUpperCase().equals("N")) {
		logDebug("WARNING: Insert Task Type must be P or N");
		return false;
	}

	var sTask;
	var tTask;

	//get the task by the task path
	var taskResult1 = aa.workflow.getTask(itemCap, sourceTaskName);
	if (taskResult1.getSuccess()) {
		tTask = taskResult1.getOutput();
	} else {
		logDebug("WARNING: Failed to get task! Path = " + sourceTaskName + ";" + taskResult1.getErrorMessage());
		return false;
	}

	//change the task name
	tTask.setTaskDescription(newTaskName);

	var taskResult = aa.workflow.insertTask(tTask, insertTaskType);
	if (taskResult.getSuccess()) {
		var processId = tTask.getProcessID();
		var stepNum = tTask.getStepNumber();
		var taskResult1 = aa.workflow.getTask(itemCap, stepNum, processId);

		if (taskResult1.getSuccess()) {
			tTask = taskResult1.getOutput();
			logDebug("add task successful : inserted task name = " + tTask.getTaskDescription() + "; Process name = " + tTask.getProcessCode());
		} else {
			logDebug("WARNING: Failed to get task! Path = " + taskPath + ";" + taskResult1.getErrorMessage());
			return false;
		}

	} else {
		logDebug("WARNING: Failed to add task! Path = " + taskPath + ";" + taskResult.getErrorMessage());
		return false;
	}

	return tTask; // returns task item
}