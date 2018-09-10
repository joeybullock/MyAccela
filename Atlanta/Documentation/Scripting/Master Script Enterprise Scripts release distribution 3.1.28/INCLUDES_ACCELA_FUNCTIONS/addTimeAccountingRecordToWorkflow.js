
function addTimeAccountingRecordToWorkflow(taskUser, taGroup, taType, dateLogged, hoursSpent, itemCap, taskName, processName, billableBool)
    {
    
    if (!aa.timeAccounting.getTimeTypeByTimeTypeName) {
		logDebug("addTimeAccountingRecordToWorkflow function required AA 7.1SP3 or higher."); return false }

    userRight = aa.userright.getUserRight(appTypeArray[0], taskUser).getOutput();

    TimeAccountingResult = aa.timeAccounting.getTimeLogModel();

    if (TimeAccountingResult.getSuccess());
    TimeAccounting = TimeAccountingResult.getOutput();

    var billable = "N";  if (billableBool) billable = "Y";
    
    TimeAccounting.setAccessModel("N");
    TimeAccounting.setBillable(billable);
    TimeAccounting.setCreatedBy(taskUser);
    TimeAccounting.setCreatedDate(aa.date.getCurrentDate());
    TimeAccounting.setDateLogged(aa.date.parseDate(dateLogged));
    TimeAccounting.setEndTime(null);
    TimeAccounting.setEntryCost(0.0);
    TimeAccounting.setEntryPct(0.0);
    TimeAccounting.setEntryRate(0.0);
    TimeAccounting.setLastChangeDate(aa.date.getCurrentDate());
    TimeAccounting.setLastChangeUser(currentUserID);
    TimeAccounting.setMaterials(null);
    TimeAccounting.setMaterialsCost(0.0);
    TimeAccounting.setMilageTotal(0.0);
    TimeAccounting.setMileageEnd(0.0);
    TimeAccounting.setMileageStart(0.0);
    TimeAccounting.setNotation(null);
    TimeAccounting.setReference(itemCap);
    TimeAccounting.setStartTime(null);
    TimeAccounting.setTotalMinutes(60 * hoursSpent);

    var timeElapsedString = "";
    if (hoursSpent.indexOf(".") != -1) {
        var vMinutes = "";
        vMinutes = hoursSpent.substr(hoursSpent.indexOf(".")) * 60;
        vMinutes = vMinutes.toString();
        if (vMinutes.length == 1) vMinutes = "0" + vMinutes;

        timeElapsedString = dateLogged + " " + hoursSpent.substr(0, hoursSpent.indexOf(".")) + ":" + vMinutes + ":00";
    }
    else
    { timeElapsedString = dateLogged + " " + hoursSpent + ":00:00"; }
    
    
    var taTypeResult = aa.timeAccounting.getTimeTypeByTimeTypeName(taType);
    if (!taTypeResult.getSuccess() || !taTypeResult.getOutput()) {
            	logDebug("**WARNING: error retrieving Timeaccounting type : " + taType + " : " + taTypeResult.getErrorMessage()); return false;   }
            	

    var taGroupResult = aa.timeAccounting.getTimeGroupByTimeGroupName(taGroup);
    if (!taGroupResult.getSuccess() || !taGroupResult.getOutput()) {
            	logDebug("**WARNING: error retrieving Timeaccounting group : " + taGroup + " : " + taGroupResult.getErrorMessage()); return false;   }

    TimeAccounting.setTimeElapsed(aa.date.parseDate(timeElapsedString));
    TimeAccounting.setTimeGroupSeq(taGroupResult.getOutput().getTimeGroupSeq());
    TimeAccounting.setTimeTypeSeq(taTypeResult.getOutput().getTimeTypeSeq());
    
    TimeAccounting.setUserGroupSeqNbr(userRight.getGroupSeqNumber()); //Required -- User Group Number from user rights
    TimeAccounting.setVehicleId(null);

    // find the task
    
    var capTasks = loadTasks(itemCap);
    var TimeLogModel = null;
    
    for (var thisTaskName in capTasks)
    	if (thisTaskName.equals(taskName) && (!processName || capTasks[thisTaskName].process.equals(processName)))
    		{
    		TimeLogModel = TimeAccounting.getTimeLogModel();
    		TimeLogModel.setEntityId(capTasks[thisTaskName].step + ":" + capTasks[thisTaskName].processID);		
		TimeLogModel.setEntityType("WORKFLOW");
    		TimeLogModel.setCapIDModel(itemCap);
    		}		

    if (TimeLogModel)
	{
	addResult = aa.timeAccounting.addTimeLogModel(TimeAccounting);
	if (addResult.getSuccess()) 
		{
        	logDebug("Successfully added Time Accounting Record to task: " + taskName);
    		}
    	else 	
    		{
        	logDebug("**WARNING: error adding Time Accounting Record to task: " + addResult.getErrorMessage());
    		}
    	}
    else
    	{
    	    logDebug("**WARNING: error adding Time Accounting Record: task " + taskName + ", process " + processName + " not found.");
    	}
}