function loadTasks(ltcapidstr)
	{
	if (typeof(ltcapidstr) == "string")
                {
		var ltresult = aa.cap.getCapID(ltcapidstr);
	 	if (ltresult.getSuccess())
  		 	ltCapId = ltresult.getOutput();
	  	else
  		  	{ logMessage("**ERROR: Failed to get cap ID: " + ltcapidstr + " error: " +  ltresult.getErrorMessage()); return false; }
                }
	else
		ltCapId = ltcapidstr;

  	var taskArr = new Array();

	var workflowResult = aa.workflow.getTasks(ltCapId);
	if (workflowResult.getSuccess())
		wfObj = workflowResult.getOutput();
	else
		{ logMessage("**ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage()); return false; }

	for (i in wfObj)
		{
		fTask = wfObj[i];
		var myTask = new Task();
		myTask.status = fTask.getDisposition();
		myTask.comment = fTask.getDispositionComment();
		myTask.process = fTask.getProcessCode();
                if (fTask.getStatusDate()) myTask.statusdate = "" + (fTask.getStatusDate().getMonth() + 1) + "/" + fTask.getStatusDate().getDate() + "/" + (fTask.getStatusDate().getYear() + 1900);
		myTask.processID = fTask.getProcessID();
		myTask.note = fTask.getDispositionNote();
		myTask.step = fTask.getStepNumber();
		myTask.active = fTask.getActiveFlag(); 
		taskArr[fTask.getTaskDescription()] = myTask;
		}
	return taskArr;
	}


function Task() // Task Object
	{
	this.status = null
	this.comment = null;
	this.note = null;
    this.statusdate = null;
	this.process = null;
	this.processID = null;
    this.step = null;
    this.active = null;
	}
	


