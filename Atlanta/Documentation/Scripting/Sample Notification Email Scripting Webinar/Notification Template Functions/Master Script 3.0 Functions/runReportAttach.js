
function runReportAttach(itemCapId,aaReportName)
	{
	// optional parameters are report parameter pairs
	// for example: runReportAttach(capId,"ReportName","altid",capId.getCustomID(),"months","12");
	

	var reportName = aaReportName;

	reportResult = aa.reportManager.getReportInfoModelByName(reportName);

	if (!reportResult.getSuccess())
		{ logDebug("**WARNING** couldn't load report " + reportName + " " + reportResult.getErrorMessage()); return false; }

	var report = reportResult.getOutput(); 

	var itemCap = aa.cap.getCap(itemCapId).getOutput();
	appTypeResult = itemCap.getCapType();
	appTypeString = appTypeResult.toString(); 
	appTypeArray = appTypeString.split("/");

	report.setModule(appTypeArray[0]); 
	report.setCapId(itemCapId.getID1() + "-" + itemCapId.getID2() + "-" + itemCapId.getID3()); 
	report.getEDMSEntityIdModel().setAltId(itemCapId.getCustomID());

	var parameters = aa.util.newHashMap();              

	for (var i = 2; i < arguments.length ; i = i+2)
		{
		parameters.put(arguments[i],arguments[i+1]);
		logDebug("Report parameter: " + arguments[i] + " = " + arguments[i+1]);
		}	

	report.setReportParameters(parameters);

	var permit = aa.reportManager.hasPermission(reportName,currentUserID); 
	if(permit.getOutput().booleanValue()) 
		{ 
		var reportResult = aa.reportManager.getReportResult(report); 

		logDebug("Report " + aaReportName + " has been run for " + itemCapId.getCustomID());

		}
	else
		logDebug("No permission to report: "+ reportName + " for user: " + currentUserID);
}
