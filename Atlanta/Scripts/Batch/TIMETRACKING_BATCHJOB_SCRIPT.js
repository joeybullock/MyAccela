batchJobName = aa.env.getValue("BatchJobName");
batchJobID = aa.batchJob.getJobID().getOutput(); 
sysDate = aa.date.getCurrentDate(); 
emailText = "";
scriptResult = aa.workflow.handleTimeTracking();

if(scriptResult.getSuccess())
{
	//Please replace with the actual Batch Job result and value for successful running
	logMessage("Time Tracking Updated","Successfully");
}
else
{
	logMessage("INFO",getErrorType.getErrorType() + ":" + scriptResult.getErrorMessage());
}

//sendMail(String FROM, String TO, String CC, String SUBJECT, String CONTENT)
//Please replace with the actual from,to,cc,subject,content of email
//sendMailResult = aa.sendMail("emailaddress@accela.com","Time Tracking Updated",emailText + "\n<br/>Don't reply it!!!");

function logMessage(etype,edesc) 
{
	if (batchJobName.length())
		aa.eventLog.createEventLog(etype, "Batch Process", batchJobName, sysDate, sysDate,"", edesc,batchJobID);
	aa.print(etype + " : " + edesc);
	emailText =etype + " : " + edesc ;
}