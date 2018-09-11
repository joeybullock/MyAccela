
/*------------------------------------------------------------------------------------------------------/
| Program: BATCH_EMAIL_ONLINE_SLA_REPORT.js  Trigger: Batch
| Client:
|
| Version 1.0 - Base Version. 9/5/2018 - Joey Bullock
|
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
|
| START: USER CONFIGURABLE PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
emailText = "";
maxSeconds = 570;      // number of seconds allowed for batch processing, usually < 5*60
message = "";
var debug = "";										// Debug String
br = "<br>";
var currentUserID = "ADMIN";
var servProvCode = aa.getServiceProviderCode();
var publicUser = false;

function getMonday(d) {
    var dd = new Date(d),
    day = dd.getDay(),
    diff = dd.getDate() - day + (day == 0 ? -6 : 1);
  return new Date(dd.setDate(diff));
}

var thisMonday = getMonday(new Date());
var thisMondayFormatted = (thisMonday.getMonth() + 1) + '/' + thisMonday.getDate() + '/' + thisMonday.getFullYear();
var todayFormatted = (new Date().getMonth() + 1) + '/' + new Date().getDate() + '/' + new Date().getFullYear();

/*------------------------------------------------------------------------------------------------------/
| BEGIN Includes
/------------------------------------------------------------------------------------------------------*/
SCRIPT_VERSION = 1.0;        // Joey Bullock on 20180905

var useSA = false;
var SA = null;
var SAScript = null;
var bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS","SUPER_AGENCY_FOR_EMSE"); 
if (bzr.getSuccess() && bzr.getOutput().getAuditStatus() != "I") { 
    useSA = true;   
    SA = bzr.getOutput().getDescription();
    bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS","SUPER_AGENCY_INCLUDE_SCRIPT"); 
    if (bzr.getSuccess()) { SAScript = bzr.getOutput().getDescription(); }
}
    
if (SA) {
    eval(getMasterScriptText("INCLUDES_ACCELA_FUNCTIONS",SA));
    eval(getMasterScriptText(SAScript,SA));
    }
else {
    eval(getMasterScriptText("INCLUDES_ACCELA_FUNCTIONS"));
    }

//eval(getScriptText("INCLUDES_BATCH"));  this is moved to below declaration of batchJobName and batchJobID
eval(getMasterScriptText("INCLUDES_CUSTOM"));

function getMasterScriptText(vScriptName){
    var servProvCode = aa.getServiceProviderCode();
    if (arguments.length > 1) servProvCode = arguments[1]; // use different serv prov code
    vScriptName = vScriptName.toUpperCase();
    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    try {
        var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(),vScriptName);
        return emseScript.getScriptText() + "";
        } catch(err) {
        return "";
    }
}


function getScriptText(vScriptName){
    var servProvCode = aa.getServiceProviderCode();
    if (arguments.length > 1) servProvCode = arguments[1]; // use different serv prov code
    vScriptName = vScriptName.toUpperCase();
    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    try {
        var emseScript = emseBiz.getScriptByPK(servProvCode,vScriptName,"ADMIN");
        return emseScript.getScriptText() + "";
        } catch(err) {
        return "";
    }
}



/*------------------------------------------------------------------------------------------------------/
|
| END: USER CONFIGURABLE PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
var showDebug = aa.env.getValue("showDebug").substring(0,1).toUpperCase().equals("Y");

var sysDate = aa.date.getCurrentDate();
var sysDateMMDDYYYY = dateFormatted(sysDate.getMonth(),sysDate.getDayOfMonth(),sysDate.getYear(),"");
batchJobResult = aa.batchJob.getJobID();
batchJobName = "" + aa.env.getValue("BatchJobName");
wfObjArray = null;

var capId = '';

batchJobID = 0;
if (batchJobResult.getSuccess())
{
    batchJobID = batchJobResult.getOutput();
    logDebug("Batch Job " + batchJobName + " Job ID is " + batchJobID);
}
else
logDebug("Batch job ID not found " + batchJobResult.getErrorMessage());

eval(getScriptText("INCLUDES_BATCH"));

/*----------------------------------------------------------------------------------------------------/
|
| Start: Function to send report
|
/------------------------------------------------------------------------------------------------------*/

function timeTrackingOnline(fromAddress,toAddress,ccAddress,reportSubject,reportContent,aaReportName)
{
    var reportName = aaReportName;
    var appTypeArray = [];
        appTypeArray[0] = 'Building';
    var capId = '';

    function getMonday(d) {
        var dd = new Date(d),
                day = dd.getDay(),
              diff = dd.getDate() - day + (day == 0 ? -6 : 1);
      return new Date(dd.setDate(diff));
    }
    
    var thisMonday = getMonday(new Date());
    var thisMondayFormatted = (thisMonday.getMonth() + 1) + '/' + thisMonday.getDate() + '/' + thisMonday.getFullYear();
    var todayFormatted = (new Date().getMonth() + 1) + '/' + new Date().getDate() + '/' + new Date().getFullYear();
	
	report = aa.reportManager.getReportInfoModelByName(reportName);
	report = report.getOutput(); 
	
	report.setModule(appTypeArray[0]); 
	report.setCapId(capId); 
	
	var parameters = aa.util.newHashMap();	
	//Make sure the parameters includes some key parameters. 
    parameters.put("p1Value", thisMondayFormatted);
    parameters.put("p2Value", todayFormatted);
	
	report.setReportParameters(parameters);

	var permit = aa.reportManager.hasPermission(reportName,currentUserID); 
	if(permit.getOutput().booleanValue()) 
	{ 
		var reportResult = aa.reportManager.getReportResult(report);

		if(reportResult)
		{
			reportResult = reportResult.getOutput();
			var reportFile = aa.reportManager.storeReportToDisk(reportResult);

			reportFile = reportFile.getOutput();
			var sendResult = aa.sendEmail(fromAddress,toAddress,ccAddress, reportSubject, reportContent, reportFile);
		}
		if(sendResult.getSuccess()) 
			logDebug("A copy of this report has been sent to the valid email addresses."); 
		else 
			logDebug("System failed send report to selected email addresses because mail server is broken or report file size is great than 5M."); 
	}
	else
		logDebug("No permission to report: "+ reportName + " for Admin" + systemUserObj);
}

/*----------------------------------------------------------------------------------------------------/
|
| End: Function to send report
|
/------------------------------------------------------------------------------------------------------*/

/*----------------------------------------------------------------------------------------------------/
|
| Start: REPORTS
|
/------------------------------------------------------------------------------------------------------*/

//Time Tracking Online Summary
fromAddress = getParam("fromAddress");                // email from
toAddress = getParam("toAddress");                    // emails to
ccAddress = getParam("ccAddress");                    // CC emails to
reportSubject = 'Time Tracking Online Summary Report for the week of ' + thisMondayFormatted + ' to ' + todayFormatted;
reportContent = 'Report run from batch script BATCH_EMAIL_ONLINE_SLA_REPORT';
timeTrackingOnline(fromAddress,toAddress,ccAddress,reportSubject,reportContent,'Time Tracking Online Summary');

/*----------------------------------------------------------------------------------------------------/
|
| End: REPORTS
|
/------------------------------------------------------------------------------------------------------*/
