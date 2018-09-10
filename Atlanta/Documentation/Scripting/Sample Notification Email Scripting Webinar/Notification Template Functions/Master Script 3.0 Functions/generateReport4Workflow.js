function generateReport4Workflow(itemCap,reportName,module,parameters) {

  //returns the report file which can be attached to an email.
  var user = currentUserID;   // Setting the User Name
  var report = aa.reportManager.getReportModelByName(reportName);
  report = report.getOutput();
  //report.setModule(module);
  //report.setCapId(itemCap);
  //report.setReportParameters(parameters); 

  var permit = aa.reportManager.hasPermission(reportName,user);

  if (permit.getOutput().booleanValue()) {
    var reportResult = aa.reportManager.runReport(parameters,report);
    if(reportResult) {
      return reportOutput = reportResult.getOutput();
      
    }  else {
      logDebug("System failed get report: " + reportResult.getErrorType() + ":" +reportResult.getErrorMessage());
      return false;
    }
  } else {
    logDebug("You have no permission.");
    return false;
  }
}