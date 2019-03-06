aa.env.setValue(appGroup,"");
aa.env.setValue(appTypeType,"");
aa.env.setValue(appSubtype,"");
aa.env.setValue(appCategory,"");
aa.env.setValue(lookAheadDays,"");
aa.env.setValue(daySpan,"");
aa.env.setValue(fromDate,"");
aa.env.setValue(toDate,"");
//aa.env.setValue(expirationStatus,"");
aa.env.setValue(setPrefix,"");
//aa.env.setValue(skipAppStatus,"");
aa.env.setValue(emailAddress,"");

/*------------------------------------------------------------------------------------------------------/
| Program: Batch Expiration.js  Trigger: Batch
| Client: Chattanooga, TN
|
| Version 1.0 - Base Version. 11/01/08 LMF
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
|
| START: USER CONFIGURABLE PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
var emailText = "";
var showDebug = 1;                           // Set to true to see debug messages in email confirmation
var maxSeconds = 4.5 * 60;                   // number of seconds allowed for batch processing, usually < 5*60
/*------------------------------------------------------------------------------------------------------/
|
| END: USER CONFIGURABLE PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
sysDate = aa.date.getCurrentDate();
batchJobResult = aa.batchJob.getJobID();
var systemUserObj = aa.person.getUser("ADMIN").getOutput();  // Current User Object
var currentUserID = "ADMIN";
batchJobName = "" + aa.env.getValue("BatchJobName");
wfObjArray = null;

batchJobID = 0;
if (batchJobResult.getSuccess())
  {
  batchJobID = batchJobResult.getOutput();
  logDebug("Batch Job " + batchJobName + " Job ID is " + batchJobID);
  logDebug("Current User: " + aa.env.getValue("CurrentUserID"));
  }
else
  logDebug("Batch job ID not found " + batchJobResult.getErrorMessage());

/*----------------------------------------------------------------------------------------------------/
|
| Start: BATCH PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/

/* 
Step 1:  Search for records matching parameters
Record Group, Type, Subtype, Category, Expiration Status, 
Expiration Start Date, and Expiration End Date
*/
var appGroup = getParam("appGroup");              	 			//  app Group to process {Licenses}
var appTypeType = getParam("appTypeType");            			//  app type to process {Rental License}
var appSubtype = getParam("appSubtype");						//  app subtype to process {NA}
var appCategory = getParam("appCategory");            			//  app category to process {NA}
var lookAheadDays = "0"; //aa.env.getValue("lookAheadDays");   		// 	Number of days from today
var daySpan = "120"; //aa.env.getValue("daySpan");          				// 	Days to search (6 if run weekly, 0 if daily, etc.)
var fromDate = getParam("fromDate");							//	Static From Date
var toDate = getParam("toDate");								//	Static To Date
var expStatus = getParam("expirationStatus")       				//  test for this expiration status
var setPrefix = getParam("setPrefix");             				//  Prefix for set ID
var setDescriptionPrefix = getParam("setDescPrefix");
var skipAppStatusArray = "";//getParam("skipAppStatus").split(",");	//	Records to skip with included statuses
var emailAddress = getParam("emailAddress");       				// 	email to send report
/*----------------------------------------------------------------------------------------------------/
|
| End: BATCH PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
var startDate = new Date();
var timeExpired = false;

if (!fromDate.length) // no "from" date, assume today + number of days to look ahead
   fromDate = dateAdd(null,parseInt(lookAheadDays))

if (!toDate.length)  // no "to" date, assume today + number of look ahead days + span
   toDate = dateAdd(null,parseInt(lookAheadDays)+parseInt(daySpan))

logDebug("Date Range -- fromDate: " + fromDate + ", toDate: " + toDate)

var startTime = startDate.getTime();         // Start timer
var systemUserObj = aa.person.getUser("ADMIN").getOutput();
// set parameter defaults if no params passed for record type
if (appGroup=="")
   appGroup="*";
if (appTypeType=="")
   appTypeType="*";
if (appSubtype=="")
   appSubtype="*";
if (appCategory=="")
   appCategory="*";
var appType = appGroup+"/"+appTypeType+"/"+appSubtype+"/"+appCategory;

/*------------------------------------------------------------------------------------------------------/
| <===========Main=Loop================>
|
/-----------------------------------------------------------------------------------------------------*/

logDebug("Start of Job");

if (!timeExpired) mainProcess();

logDebug("End of Job: Elapsed Time : " + elapsed() + " Seconds");

if (emailAddress.length)
   aa.sendMail("noreply@accela.com", emailAddress, "", batchJobName + " - BUSINESS LICENSE RENEWAL RESULTS", emailText);


/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/


/*------------------------------------------------------------------------------------------------------/
| <===========External Functions (used by Action entries)
/------------------------------------------------------------------------------------------------------*/

function mainProcess()
{
	var capFilterType = 0
	var capFilterStatus = 0;
	var capCount = 0;
	var setName;
	var setDescription;

	/*
	Step 1, Part 2 - Search for records matching expiration status and date
	*/
	var expResult = aa.expiration.getLicensesByDate(expStatus,fromDate,toDate);

	if (expResult.getSuccess())
	{
		myExp = expResult.getOutput();
		logDebug("Processing " + myExp.length + " expiration records");
	}
	else
	{ 
		logDebug("ERROR: Getting Expirations, reason is: " + expResult.getErrorType() + ":" + expResult.getErrorMessage());
		return false 
	}

	for (thisExp in myExp)  // for each b1expiration (effectively, each license app)
	{
		if (elapsed() > maxSeconds) // only continue if time hasn't expired
		{
			logDebug("A script timeout has caused partial completion of this process.  Please re-run.  " + elapsed() + " seconds elapsed, " + maxSeconds + " allowed.") ;
			timeExpired = true;
			break;
		}

		b1Exp = myExp[thisExp];
		var   expDate = b1Exp.getExpDate();
		if (expDate) 
			var b1ExpDate = expDate.getMonth() + "/" + expDate.getDayOfMonth() + "/" + expDate.getYear();
		var b1Status = b1Exp.getExpStatus();

		capId = aa.cap.getCapID(b1Exp.getCapID().getID1(),b1Exp.getCapID().getID2(),b1Exp.getCapID().getID3()).getOutput();

		if (!capId)
		{
			logDebug("Could not get a Cap ID for " + b1Exp.getCapID().getID1() + "-" + b1Exp.getCapID().getID2() + "-" + b1Exp.getCapID().getID3());
			logDebug("This is likely being caused by 09ACC-03874.   Please disable outgoing emails until this is resolved")
			continue;
		}

		altId = capId.getCustomID();

		logDebug(altId + ": Renewal Status : " + b1Status + ", Expires on " + b1ExpDate);

		cap = aa.cap.getCap(capId).getOutput();
		var capStatus = cap.getCapStatus();

		appTypeResult = cap.getCapType();      //create CapTypeModel object
		appTypeString = appTypeResult.toString();
		appTypeArray = appTypeString.split("/");

		/*
		Step 1, Part 3, only include records that match cap type
		*/
		// Filter by CAP Type
		if (appType.length && !appMatch(appType))
		{
			capFilterType++;
			logDebug(altId + ": Application Type does not match");
			continue;
		}                           

		// Filter by CAP Status
		if (exists(capStatus,skipAppStatusArray))
		{
			capFilterStatus++;
			logDebug(altId + ": skipping due to application status of " + capStatus);
			continue;
		}

		capCount++;

		// Create Set
		if (setPrefix != "" && capCount == 1)
		{
			var yy = startDate.getFullYear().toString().substr(2,2);
			var mm = (startDate.getMonth()+1).toString();
			if (mm.length<2)
				mm = "0"+mm;
			var dd = startDate.getDate().toString();
			if (dd.length<2)
				dd = "0"+dd;
			var hh = startDate.getHours().toString();
			if (hh.length<2)
				hh = "0"+hh;
			var mi = startDate.getMinutes().toString();
			if (mi.length<2)
				mi = "0"+mi;

			var setName = setPrefix.substr(0,5) + yy + mm + dd + hh + mi;

			setDescription = setDescriptionPrefix + " : " + startDate.toLocaleString()
			var setCreateResult= aa.set.createSet(setName,setDescription)

			if (setCreateResult.getSuccess())
				logDebug("Set ID "+setName+" created for CAPs processed by this batch job.");
			else
				logDebug("ERROR: Unable to create new Set ID "+setName+" created for CAPs processed by this batch job.");
		}
		
		// Add to Set
		if (setPrefix != "")
		{ 
			aa.set.add(setName,capId);
			logDebug(altId + ": Added to set");
		
		}



		logDebug("Total " + appType + " CAPS qualified date range: " + (myExp.length - capFilterType));
		logDebug("Ignored due to CAP Status: " + capFilterStatus);
		logDebug("Total CAPS processed: " + capCount);	
	}
}

/*------------------------------------------------------------------------------------------------------/
| <===========Internal Functions and Classes (Used by this script)
/------------------------------------------------------------------------------------------------------*/

function appMatch(ats)
   {
   var isMatch = true;
   var ata = ats.split("/");
   if (ata.length != 4)
      logDebug("ERROR in appMatch.  The following Application Type String is incorrectly formatted: " + ats);
   else
      for (xx in ata)
         if (!ata[xx].equals(appTypeArray[xx]) && !ata[xx].equals("*"))
            isMatch = false;
   return isMatch;
   }

function elapsed() {
   var thisDate = new Date();
   var thisTime = thisDate.getTime();
   return ((thisTime - startTime) / 1000)
}

function logDebug(edesc) 
	{	
	if (showDebug) 
		{		
		aa.eventLog.createEventLog("DEBUG", "Batch Process", batchJobName, sysDate, sysDate,"", edesc,batchJobID);		
		aa.print("DEBUG : " + edesc);		emailText+="DEBUG : " + edesc + "\n"; 
		}
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

function getCapId(pid1,pid2,pid3)  {

    var s_capResult = aa.cap.getCapID(pid1, pid2, pid3);
    if(s_capResult.getSuccess())
      return s_capResult.getOutput();
    else
    {
      logDebug("ERROR: Failed to get capId: " + s_capResult.getErrorMessage());
      return null;
    }
  }

function getParam(pParamName) //gets parameter value and logs message showing param value
   {
   var ret = "" + aa.env.getValue(pParamName);
   logDebug("Parameter : " + pParamName+" = "+ret);
   return ret;
   }

function exists(eVal, eArray) 
{
// exists:  return true if Value is in Array
//

     for (ii in eArray)
      if (eArray[ii] == eVal) return true;
     return false;
}

function matches(eVal,argList) {
   for (var i=1; i<arguments.length;i++)
      if (arguments[i] == eVal)
         return true;

}