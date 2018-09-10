/*
aa.env.setValue("showDebug","Y");
aa.env.setValue("appGroup","Enforce");
aa.env.setValue("appType","Lien");
aa.env.setValue("emailAddress","kgurney@accela.com");
aa.env.setValue("BatchJobName","TestBatch"); 
*/
/*------------------------------------------------------------------------------------------------------/
| Program: BATCH_LIENMONTHLYPROCESS.js  Trigger: Batch
| Client:
|
| Version 1.0 - Base Version. 07/19/2014 - Kevin Gurney
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


/*------------------------------------------------------------------------------------------------------/
| BEGIN Includes
/------------------------------------------------------------------------------------------------------*/
SCRIPT_VERSION = 3.0;        //Tweaked by Joey Bullock on 20180402

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
| Start: BATCH PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/

var emailAddress = getParam("emailAddress");                    // email to send report
var appGroup = getParam("appGroup");
var appType = getParam("appType");
var appSubType = getParam("appSubType");
var appCategory = getParam("appCategory");


/*----------------------------------------------------------------------------------------------------/
|
| End: BATCH PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
var startDate = new Date();
var timeExpired = false;
var capId = null;
var useAppSpecificGroupName = false;	// Use Group name when populating App Specific Info Values

var startTime = startDate.getTime();            // Start timer
var systemUserObj = aa.person.getUser("ADMIN").getOutput();


/*------------------------------------------------------------------------------------------------------/
| <===========Main=Loop================>
|
/-----------------------------------------------------------------------------------------------------*/

logDebug("Start of Job");
logDebug("********************************");

if (!timeExpired) mainProcess();

logDebug("End of Job: Elapsed Time : " + elapsed() + " Seconds");



if (emailAddress.length)
   aa.sendMail("accela_noreply@atlantaga.gov", emailAddress, "", batchJobName + " Results", emailText);

/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/


function mainProcess() {
	var capCountTotal = 0;
	var capCountNotProcessed = 0;
	var capCountProcessed = 0;
	
	capArryCall = aa.cap.getByAppType("Enforce","Lien");
	
		
    if (capArryCall.getSuccess()) {
		capArry = capArryCall.getOutput();
	}
	
	if (capArry.length > 0)
		for (yyy in capArry)  // for each record
			{   
				if (elapsed() > maxSeconds) // only continue if time hasn't expired
				{ 
				logMessage("WARNING","A script timeout has caused partial completion of this process.  Please re-run.  " + elapsed() + " seconds elapsed, " + maxSeconds + " allowed.") ;
				timeExpired = true ;
				break; 
				}
			thisCap = capArry[yyy];
			capId = thisCap.getCapID();
	
			if (!capId)
				{
				logDebug("Could not get a Cap ID for " + capArry1.getCapID().getID1() + "-" + capArry1.getCapID().getID2() + "-" + capArry1.getCapID().getID3());
				continue;
				}
			capCountTotal++;
			altId = capId.getCustomID();
			cap = aa.cap.getCap(capId).getOutput();		
			appTypeResult = cap.getCapType();
			capStatus = cap.getCapStatus();		
			appTypeString = appTypeResult.toString();	
			appTypeArray = appTypeString.split("/");
						
			if (!matches(capStatus,"Open"))
				{
				capCountNotProcessed++;
				continue;
				}
			
			//load ASI info
			var AInfo = new Array();
			loadAppSpecific(AInfo);
			var todayJS = new Date();
			var lienRecordDate = AInfo["Lien Recording Date"];
			var nbrMosExp = AInfo["No. of Months Expired"];
			var penaltyAmtFloat = AInfo["Penalty Amount"];
			var penaltyAmt = parseFloat(penaltyAmtFloat).toFixed(2);
			var lienIntAmtFloat = AInfo["Lien Interest per Month"];
			var lienIntAmt = parseFloat(lienIntAmtFloat).toFixed(2);
			var noticeSentDate = AInfo["Notice Sent Date"];
			var noticeSentDateJS = new Date(noticeSentDate);
			var lienRecordDateJS = new Date(lienRecordDate);
			
			//Calculate Date differences
			var nbrMosBetween = monthDiff(lienRecordDateJS,todayJS);
			var nbrDysBetweenLien = 0;
			if (lienRecordDate != null)
				{
				nbrDysBetweenLien = dateDiff(lienRecordDateJS,todayJS);
				}
			var nbrDysBetween = 0;
			if (noticeSentDate != null)
				{
				nbrDysBetween = dateDiff(noticeSentDateJS,todayJS);
				}
						
			//load fee balance info for principal amt
			var prinRemainBal = feeBalance("PRINAMT","LIEN");
			var intRemainBal = 0;
			intRemainBal = feeBalance("INT","LIEN");
			intRemainBalToFixed = parseFloat(intRemainBal).toFixed(2);
			var intChrg = prinRemainBal * 0.01;
			var dontChargeInt = false;
		
			//check if ok to assess penalty and or interest fee
			feeSeqList = new Array();
			paymentPeriodList = new Array();
			if (!feeExists("PENALTY","NEW","INVOICED") && penaltyAmt > 0 && nbrDysBetween > 30)
				{
				feeSeqPen = updateFee("PENALTY","LIEN","FINAL",penaltyAmt,"Y","Y");
				feeSeqList.push(feeSeqPen);
				paymentPeriodList.push("FINAL");
				}
			if ((nbrMosBetween * lienIntAmt) <= intRemainBalToFixed) {
				dontChargeInt = true;
			}
			if (prinRemainBal > 0 && nbrDysBetweenLien > 30 && dontChargeInt === false)
				{
				feeSeqInt = updateFee("INT","LIEN","FINAL",(nbrMosBetween * lienIntAmt).toFixed(2),"Y","Y");
				capCountProcessed++;
				feeSeqList.push(feeSeqInt);
				paymentPeriodList.push("FINAL");
				logDebug("Record nbr " + altId + " has been processed");
				} else {
				capCountNotProcessed++;
				continue;
				}
			
			//update ASI Interest Remaining Balance
			if (prinRemainBal > 0 && nbrDysBetweenLien > 30)
			{
				intRemainBal = feeBalance("INT","LIEN");
				editAppSpecific("Total Interest Remaining Balance",(intRemainBal).toFixed(2),capId);
				editAppSpecific("No. of Months Expired",nbrMosBetween,capId);
				editAppSpecific("Total Amount of Interest",(nbrMosBetween * lienIntAmt).toFixed(2),capId);
			}			 
	    }//end main loop
		
		logDebug("********************************");
		logDebug("Total Records: " + capCountTotal);
		logDebug("Total Records Not Processed: " + capCountNotProcessed);
		logDebug("Total Records Processed: " + capCountProcessed);
}

function monthDiff(date1, date2) {
    var months;
    months = (date2.getFullYear() - date1.getFullYear()) * 12;
    months -= date1.getMonth() + 1;
    months += date2.getMonth() + 1;
    return months <= 0 ? 0 : months;
}
function dateDiff(date1, date2) {

    return (convertDate(date2).getTime() - convertDate(date1).getTime()) / (1000 * 60 * 60 * 24);
}