/*------------------------------------------------------------------------------------------------------/
| Program: BatchExpireLicenses.js  Trigger: Batch    Client : Chattanooga   SAN# : 05SSP-00470
| 
| Version 0.1 - Base Version -							12/28/2005 - John Schomp
| Version 0.2 - Added deactivation for licenses three years older.  
|               Added update to application status                              06/05/2006 - John Schomp
|
| Expires licenses that expire on the current day.  Changes B1Expiration.  Must be run daily.
/------------------------------------------------------------------------------------------------------*/
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

var licenseStatus = ["About To Expire","Inactive","Delinquent"];  // execute for each of these statuses
var licenseToStatus = "Delinquent";		 // when done, set the b1expiration.status to this
var licenseDeactivate = "Expired";			 // if more than three years old, expire

/*------------------------------------------------------------------------------------------------------/
|
| END USER CONFIGURABLE PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
var fromDate = "" + aa.env.getValue("fromDate");
var toDate = "" + aa.env.getValue("toDate");
var batchJobName = aa.env.getValue("BatchJobName");
var emailAddress = aa.env.getValue("emailAddress");

//testing
//fromDate = "6/30/2005";
//toDate = "6/30/2005" ;
//batchJobName = "ExpireLicenses";
//emailAddress = "jschomp@accela.com";

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
batchJobID = aa.batchJob.getJobID().getOutput();

if (!fromDate.length) // no "from" date, assume today
	fromDate = (startDate.getMonth() + 1) + "/" + startDate.getDate() + "/" + startDate.getFullYear();

if (!toDate.length)  // no "to" date, assume today
	toDate = (startDate.getMonth() + 1) + "/" + startDate.getDate() + "/" + startDate.getFullYear();


/*------------------------------------------------------------------------------------------------------/
| <===========Main=Loop================>
| 
/-----------------------------------------------------------------------------------------------------*/


logMessage("START","Start of Job");
logMessage("PARAMETER","fromDate = " + fromDate);
logMessage("PARAMETER","toDate = " + toDate);
logMessage("PARAMETER","emailAddress = " + emailAddress);

for (icount in licenseStatus)
	{
	if (!timeExpired) expireLicenses(licenseStatus[icount]);
	if (!timeExpired) deactivateLicenses(licenseStatus[icount]);
	}

logMessage("END","End of Job: Elapsed Time : " + elapsed() + " Seconds");

if (emailAddress.length) aa.sendMail("noreply@accela.com", emailAddress, "", batchJobName + " Results", emailText);
		
/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/


/*------------------------------------------------------------------------------------------------------/
| <===========External Functions (used by Action entries)
/------------------------------------------------------------------------------------------------------*/

function expireLicenses(licStat)
	{
	var capCount = 0;
	var expResult = aa.expiration.getLicensesByDate(licStat,fromDate,toDate);
	
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
		
		// get license details
		capId = myExp[zzz].getCapID();			
		capIDshow = capId.getID1() + "-" + capId.getID2() + "-" + capId.getID3(); 
	
	  	logDebug("Expiring Cap " + capIDshow);
		capCount++;
		
		expModel = myExp[zzz].getB1Expiration();
		expModel.setExpStatus(licenseToStatus);
		aa.expiration.editB1Expiration(expModel);
		updateAppStatus(licenseToStatus,"changed via Script")
 		}
 	logMessage("INFO","Expired " + capCount + " Licenses of Status " + licStat);
 	}
 	
 function deactivateLicenses(licStat)
 	{
 	var capCount = 0;
 	var expResult = aa.expiration.getLicensesByDate(licStat,dateAdd(fromDate,-1095),dateAdd(toDate,-1095));
 	
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
 		
 		// get license details
 		capId = myExp[zzz].getCapID();			
 		capIDshow = capId.getID1() + "-" + capId.getID2() + "-" + capId.getID3(); 
 	
 	  	logDebug("Deactivating Cap " + capIDshow);
 		capCount++;
 		
 		expModel = myExp[zzz].getB1Expiration();
 		expModel.setExpStatus(licenseDeactivate);
 		aa.expiration.editB1Expiration(expModel);
 		updateAppStatus(licenseDeactivate,"changed via Script")
 		
  		}
  	logMessage("INFO","Deactivated " + capCount + " Licenses of Status " + licStat);
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
	aa.eventLog.createEventLog(etype, "Batch Process", batchJobName, sysDate, sysDate,"", edesc,batchJobID);
	aa.print(etype + " : " + edesc);
	emailText+=etype + " : " + edesc + "\n";
	}

function logDebug(edesc) {
	if (showDebug) {
		aa.eventLog.createEventLog("DEBUG", "Batch Process", batchJobName, sysDate, sysDate,"", edesc,batchJobID);
		aa.print("DEBUG : " + edesc);
		emailText+="DEBUG : " + edesc + "\n"; }
	}

function dateAdd(td,amt)   
// perform date arithmetic on a string 
// td can be "mm/dd/yyyy" (or any string that will convert to JS date)
// amt can be positive or negative (5, -3) days 
// if optional parameter #3 is present, use working days only
	{
	
	useWorking = false;
	if (arguments.length == 3) 
		useWorking = true;
	
	if (!td) 
		dDate = new Date();
	else
		dDate = new Date(td);
	i = 0;
	if (useWorking)
		while (i < Math.abs(amt)) 
			{
			dDate.setTime(dDate.getTime() + (1000 * 60 * 60 * 24 * (amt > 0 ? 1 : -1)));
			if (dDate.getDay() > 0 && dDate.getDay() < 6)
				i++
			}
	else
		dDate.setTime(dDate.getTime() + (1000 * 60 * 60 * 24 * amt));

	return (dDate.getMonth()+1) + "/" + dDate.getDate() + "/" + dDate.getFullYear();
	}
	
function updateAppStatus(stat,cmt) // optional cap id
	{
	
	itemCap = capId;
	if (arguments.length == 3) itemCap = arguments[2]; // use cap ID specified in args

	var systemUserObj = aa.person.getUser("ADMIN").getOutput();
	updateStatusResult = aa.cap.updateAppStatus(itemCap,"APPLICATION",stat, sysDate, cmt ,systemUserObj);
	if (updateStatusResult.getSuccess())
		logDebug("Updated application status to " + stat + " successfully.");
	else
		logDebug("ERROR: application status update to " + stat + " was unsuccessful.  The reason is "  + updateStatusResult.getErrorType() + ":" + updateStatusResult.getErrorMessage());
	}