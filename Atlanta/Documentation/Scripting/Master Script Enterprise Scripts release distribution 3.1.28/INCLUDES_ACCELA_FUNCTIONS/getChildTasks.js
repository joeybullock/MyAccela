function getChildTasks(taskName) {
	var childTasks = new Array();
	var childId = null;
	var itemCap = capId
		if (arguments.length > 1)
			itemCap = arguments[1]; // use cap ID specified in args

		var workflowResult = aa.workflow.getTaskItems(itemCap, taskName, null, null, null, null);
	var wfObj = workflowResult.getOutput();
	for (i in wfObj) {
		var fTaskSM = wfObj[i];
		if (fTaskSM.getTaskDescription().equals(taskName)) {
			var relationArray = aa.workflow.getProcessRelationByCapID(itemCap, null).getOutput()
				for (thisRel in relationArray) {
					y = relationArray[thisRel]
						if (y.getParentTaskName() && y.getParentTaskName().equals(fTaskSM.getTaskDescription()))
							childId = y.getProcessID()
				}
		}
	}

	for (i in wfObj) {
		var fTaskSM = wfObj[i];
		if (fTaskSM.getProcessID() == childId)
			childTasks.push(fTaskSM)
	}

	return childTasks;

}
