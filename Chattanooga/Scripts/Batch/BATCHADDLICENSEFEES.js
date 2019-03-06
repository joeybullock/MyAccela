/*----------------------/
|Script Initializer
/-----------------------*/
aa.env.setValue("fromDate","06/29/2004");
aa.env.setValue("toDate","07/01/2006");
aa.env.setValue("licensePeriod","LTRADE");
aa.env.setValue("emailAddress","mhart@accela.com");
aa.env.setValue("batchJobName","AddLicenseFees");
aa.env.setValue("Gas","N");
aa.env.setValue("Mechanical","N");
aa.env.setValue("Plumbing","Y");
/*----------------------/
|Script Text
/-----------------------*/
/*------------------------------------------------------------------------------------------------------/
| Program: BatchAddLicenseFees.js  Trigger: Batch    Client : Chattanooga   SAN# : 05SSP-00470
| 
| Version 0.1 - Base Version -							12/13/2005 - John Schomp
|
/------------------------------------------------------------------------------------------------------*/
var doGas = aa.env.getValue("Gas").equals("Y");
var doMechanical = aa.env.getValue("Mechanical").equals("Y");
var doPlumbing = aa.env.getValue("Plumbing").equals("Y");
/*------------------------------------------------------------------------------------------------------/
|
| START USER CONFIGURABLE PARAMETERS
|
| Work Array: controls actions.  Pipe delimited
|   wa[x][0]:  application type, wildcards allowed, e.g. "Licenses/Mechanical/Plumbing/NA"
|   wa[x][1]:  fee item code, e.g. JGASLIC
|   wa[x][2]:  fee schedule, e.g. LICGAS
|
/------------------------------------------------------------------------------------------------------*/
var wa = new Array();
var showDebug = false;					// Set to true to see debug messages
var maxSeconds = 4 * 60;				// number of seconds allowed for batch processing, usually < 5*60

var licenseStatus = ["Active","Inactive","Delinquent"];  // execute for each of these statuses
var licenseToStatus = "About To Expire";		 // when done, set the b1expiration.status to this

/*------------------------------------------------------------------------------------------------------/
|
| END USER CONFIGURABLE PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
var fromDate = aa.env.getValue("fromDate");
var toDate = aa.env.getValue("toDate");
var licensePeriod = aa.env.getValue("licensePeriod");
var batchJobName = aa.env.getValue("BatchJobName");
var emailAddress = aa.env.getValue("emailAddress");

//testing
//fromDate = "5/25/2005";
//toDate = "12/31/2005" ;
//licensePeriod = "LTRADE";
//batchJobName = "LicenseFeeAdd";
//emailAddress = "jschomp@accela.com";
//doGas = true;  doMechanical = true; doPlumbing = true;

/*----------------------------------------------------------------------------------------------------/
|
| END BATCH PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
var startDate = new Date();
var timeExpired = false;
var emailText = "";
var startTime = startDate.getTime();			// Start timer
var sysDate = aa.date.getCurrentDate();
var batchJobID = aa.batchJob.getJobID().getOutput();

// for invoicing
var feeSeqList;
var paymentPeriodList;

/*------------------------------------------------------------------------------------------------------/
| <===========Main=Loop================>
| 
/-----------------------------------------------------------------------------------------------------*/

logMessage("START","Start of Job");
logMessage("PARAMETER","fromDate = " + fromDate);
logMessage("PARAMETER","toDate = " + toDate);
logMessage("PARAMETER","licensePeriod = " + licensePeriod);
logMessage("PARAMETER","emailAddress = " + emailAddress);
logMessage("PARAMETER","Gas = " + aa.env.getValue("Gas"));
logMessage("PARAMETER","Plumbing = " + aa.env.getValue("Plumbing"));
logMessage("PARAMETER","Mechanical = " + aa.env.getValue("Mechanical"));

if (doGas) {
	wa.push("Licenses/Contractor/Gas/Journeyman|JGASLIC|LICGAS");
	wa.push("Licenses/Contractor/Gas/Master|MGASLIC|LICGAS");
	wa.push("Licenses/Contractor/Gas/*|TECH FEE|LICGAS"); 
	logDebug("Updating Gas Licenses") }
	
if (doPlumbing) {
	wa.push("Licenses/Contractor/Plumbing/Journeyman|JPLUMBLIC|LICPLUMB");
	wa.push("Licenses/Contractor/Plumbing/Master|MPLUMBLIC|LICPLUMB");
	wa.push("Licenses/Contractor/Plumbing/*|TECH FEE|LICPLUMB");  
	logDebug("Updating Plumbing Licenses") }

if (doMechanical) {
	wa.push("Licenses/Contractor/Mechanical/Journeyman|JMECHLIC|LICMECH");
	wa.push("Licenses/Contractor/Mechanical/Master|MMECHLIC|LICMECH");
	wa.push("Licenses/Contractor/Mechanical/*|TECH FEE|LICMECH"); 
	logDebug("Updating Mechanical Licenses"); }

for (icount in licenseStatus)
	if (!timeExpired) doLicenses(licenseStatus[icount],fromDate,toDate);

logMessage("END","End of Job: Elapsed Time : " + elapsed() + " Seconds");

if (emailAddress.length) aa.sendMail("noreply@accela.com", emailAddress, "", batchJobName + " Results", emailText);
		
/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/


/*------------------------------------------------------------------------------------------------------/
| <===========External Functions (used by Action entries)
/------------------------------------------------------------------------------------------------------*/

function doLicenses(licStat,fromDt,toDt)
	{
	var expResult = aa.expiration.getLicensesByDate(licStat,fromDt,toDt);
	var feeCount = 0; //number of fees processed
	var fcode = "";

	if (expResult.getSuccess())
		myExp = expResult.getOutput();
	else
		{ logMessage("ERROR","ERROR: Getting Expirations, reason is: " + expResult.getErrorType() + ":" + expResult.getErrorMessage()) ; return false }

	for (zzz in myExp)  // for each b1expiration (effectively, each license app)
		{
		if (elapsed() > maxSeconds) // only continue if time hasn't expired
			{ 
			logMessage("WARNING","A script timeout has caused partial completion of this process.  Please re-run.  " + elapsed() + " seconds elapsed, " + maxSeconds + " allowed.") ;
			timeExpired = true ;
			break; 
			}
		// for invoicing
		feeSeqList = new Array();
		paymentPeriodList = new Array();
			
		// get license details
		capId = myExp[zzz].getCapID();			
		capIDshow = capId.getID1() + "-" + capId.getID2() + "-" + capId.getID3(); 
		cap = aa.cap.getCap(capId).getOutput();		
		appTypeResult = cap.getCapType();			
		appTypeString = appTypeResult.toString();	
		appTypeArray = appTypeString.split("/");		
		
	  	logDebug("Looking at Cap " + capIDshow);
		
		for (ii in wa)  // for each control array
			{
			actions = wa[ii].split("|");
			if (appMatch(actions[0]))		// Matched the application type
				{
				addFee(actions[1],actions[2],licensePeriod,1,"Y") // Adds a single fee
				++feeCount;
				expModel = myExp[zzz].getB1Expiration();
				expModel.setExpStatus(licenseToStatus);
				aa.expiration.editB1Expiration(expModel);
				}
			}

		if (feeSeqList.length)  // invoice added fees
			{
			invoiceResult = aa.finance.createInvoice(capId, feeSeqList, paymentPeriodList);
			if (invoiceResult.getSuccess())
				logDebug("Invoicing assessed fee items is successful.");
			else
				logMessage("ERROR","ERROR: Invoicing the fee items was not successful.  Reason: " +  invoiceResult.getErrorMessage());
			}
		}
	  	if (feeCount) logMessage("INFO", feeCount + " Fee Codes Added");
  }
	
function appMatch(ats) 
	{
	var isMatch = true;
	var ata = ats.split("/");
	if (ata.length != 4)
		logMessage("ERROR","ERROR in appMatch.  The following Application Type String is incorrectly formatted: " + ats);
	else
		for (xx in ata)
			if (!ata[xx].equals(appTypeArray[xx]) && !ata[xx].equals("*"))
				isMatch = false;
	return isMatch;
	}
	
function addFee(fcode,fsched,fperiod,fqty,finvoice) // Adds a single fee
	{
	assessFeeResult = aa.finance.createFeeItem(capId,fsched,fcode,fperiod,fqty);
	if (assessFeeResult.getSuccess())
		{
		feeSeq = assessFeeResult.getOutput();
		logDebug("Successfully added Fee " + fcode + ", Qty " + fqty);
		if (finvoice == "Y")
			{
			feeSeqList.push(feeSeq);
			paymentPeriodList.push(fperiod);
			}
		}
	else
		{
		logMessage("ERROR","ERROR: assessing fee (" + fcode + "): " + assessFeeResult.getErrorMessage());
		}
	}

/*------------------------------------------------------------------------------------------------------/
| <===========Internal Functions and Classes (Used by this script)
/------------------------------------------------------------------------------------------------------*/


function elapsed() {
	var thisDate = new Date();
	var thisTime = thisDate.getTime();
	return ((thisTime - startTime) / 1000) 
}	

function logMessage(etype,edesc) {
	if (batchJobID)	aa.eventLog.createEventLog(etype, "Batch Process", batchJobName, sysDate, sysDate,"", edesc,batchJobID);
	aa.print(etype + " : " + edesc);
	emailText+=etype + " : " + edesc + "\n";
	}

function logDebug(edesc) {
	if (showDebug) {
		if (batchJobID)	aa.eventLog.createEventLog("DEBUG", "Batch Process", batchJobName, sysDate, sysDate,"", edesc,batchJobID);
		aa.print("DEBUG : " + edesc);
		emailText+="DEBUG : " + edesc + "\n"; }
	}
