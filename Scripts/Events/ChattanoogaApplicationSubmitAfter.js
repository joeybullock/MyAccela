/*------------------------------------------------------------------------------------------------------/
| Program: ApplicationSubmitAfter.js  Trigger: ApplicationSubmitAfter    Client : N/A   SAN# : N/A
| 
| Master Script, documentation: http://intranet/services_eventmgr.htm
|                                                                       
| Version 0.1 - Base Version -							10/13/2005 - John Schomp
| Version 0.5 - Move to Criteria/Action pairs for all entries			10/29/2005 - John Schomp
| Version 1.0 - Added disableTokens functionality, controls "{}[]" replacement  12/12/2005 - John Schomp
|             - Added Task Specific Info to AInfo array
|             - Added elapsed time info to debug
|             - Many new functions for production release candidate
| Version 1.1 - Added ability to prefix app specific and task specific info     01/25/2005 - John Schomp
|               with group names using boolean flags: 
|               useAppSpecificGroupName, useTaskSpecificGroupName
|               removed tokenizing of [ and ] for parcel attributes.  Now uses { and } 
|               and ParcelAttribute. prefix.  (e.g. {ParcelAttribute.Subdivision} )
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
|
| START USER CONFIGURABLE PARAMETERS
|
|	Almost all user configurable parameters are stored in Standard Choices:
|	
|	Application Submittal Script Control : 	Points to Criteria/Action pairs (Standard Choice Entries)
|						by Application Type
|
/------------------------------------------------------------------------------------------------------*/
var showMessage = false;			// Set to true to see results in popup window
var showDebug = false;				// Set to true to see debug messages in popup window
var controlString = "ApplicationSubmitAfter";  // Standard choice for control
var documentOnly = false;			// Document Only -- displays hierarchy of std choice steps
var disableTokens = false;			// turn off tokenizing of App Specific and Parcel Attributes
var useAppSpecificGroupName = false;		// Use Group name when populating App Specific Info Values
var useTaskSpecificGroupName = false;		// Use Group name when populating Task Specific Info Values

/*----------------------------------------------------------------------------------------------------/
|
| END USER CONFIGURABLE PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
var startDate = new Date();
var startTime = startDate.getTime();
var message =	"";					// Message String
var debug = "";
var br = "<BR>";					// Break Tag

if (documentOnly) { 
	doStandardChoiceActions(controlString,false,0); 
	aa.env.setValue("ScriptReturnCode", "0"); 
	aa.env.setValue("ScriptReturnMessage", "Documentation Successful.  No actions executed.");
	aa.abortScript(); 
	}

var capId = getCapId();					// CapId object
var cap = aa.cap.getCap(capId).getOutput();		// Cap object
var currentUserID = aa.env.getValue("CurrentUserID");   // Current USer
var capIDString = capId.getCustomID();			// alternate cap id string
var appTypeResult = cap.getCapType();			// Get Application Type
var appTypeString = appTypeResult.toString();		// Convert application type to string ("Building/A/B/C")
var appTypeArray = appTypeString.split("/");		// Array of application type string
var AInfo = AppSpecific(capId); 			// Create associative array of appspecifc info
loadTaskSpecific();					// Add task specific info
loadParcelAttributes();					// Add parcel attributes
var systemUserObj = aa.person.getUser(currentUserID).getOutput();  // Current User Object
var sysDate = aa.date.getCurrentDate();
var feeSeqList = new Array();				// invoicing fee list
var paymentPeriodList = new Array();			// invoicing pay periods
var estValue = 0; var calcValue = 0;			// Init Valuations
var valobj = aa.finance.getContractorSuppliedValuation(capId,null).getOutput();	// Calculated valuation 
if (valobj.length) {
	estValue = valobj[0].getEstimatedValue();	// Use Contractor Value
	calcValue = valobj[0].getCalculatedValue();	// Use Calcuated Value
	}

if (currentUserID == 'BULLOCK_J'){
	showDebug = true;
}
	
debug+="Cap ID: " + capIDString + br;
debug+="apptypestring = " + appTypeString + br;
debug+="estValue = " + estValue + br;
debug+="calcValue = " + calcValue + br;
/*------------------------------------------------------------------------------------------------------/
| <===========Main=Loop================>
| 
/-----------------------------------------------------------------------------------------------------*/
//
//
//  Get the Standard choices entry we'll use for this App type
//  Then, get the action/criteria pairs for this app
//

doStandardChoiceActions(controlString,true,0);
//
// Check for invoicing of fees
//
if (feeSeqList.length)
	{
	invoiceResult = aa.finance.createInvoice(capId, feeSeqList, paymentPeriodList);
	if (invoiceResult.getSuccess())
		message+="Invoicing assessed fee items is successful." + br;
	else
		debug+="ERROR: Invoicing the fee items assessed to app # " + appId + " was not successful.  Reason: " +  invoiceResult.getErrorMessage();
	}
		
/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/

if (debug.indexOf("ERROR") > 0)
	{
	aa.env.setValue("ScriptReturnCode", "1");
	aa.env.setValue("ScriptReturnMessage", debug);
	}
else
	{
	aa.env.setValue("ScriptReturnCode", "0");
	if (showMessage) aa.env.setValue("ScriptReturnMessage", message);
	if (showDebug) 	aa.env.setValue("ScriptReturnMessage", debug);
	}

/*------------------------------------------------------------------------------------------------------/
| <===========Internal Functions and Classes (Used by this script)
/------------------------------------------------------------------------------------------------------*/

function AppSpecific() {
	// 
	// Returns an associative array of App Specific Info
	//
  	appArray = new Array();
    	var appSpecInfoResult = aa.appSpecificInfo.getByCapID(capId);
	if (appSpecInfoResult.getSuccess())
	 	{
		var fAppSpecInfoObj = appSpecInfoResult.getOutput();

		for (loopk in fAppSpecInfoObj)
			{
			if (useAppSpecificGroupName)
				{
				appArray[fAppSpecInfoObj[loopk].getCheckboxType() + "." + fAppSpecInfoObj[loopk].checkboxDesc] = fAppSpecInfoObj[loopk].checklistComment;
				debug+="{" + fAppSpecInfoObj[loopk].getCheckboxType() + "." + fAppSpecInfoObj[loopk].checkboxDesc + "} = " + fAppSpecInfoObj[loopk].checklistComment + br;
				}
			else
				{
				appArray[fAppSpecInfoObj[loopk].checkboxDesc] = fAppSpecInfoObj[loopk].checklistComment;
				debug+="{" + fAppSpecInfoObj[loopk].checkboxDesc + "} = " + fAppSpecInfoObj[loopk].checklistComment + br;
				}
			}
		}
	return appArray;
}

function loadParcelAttributes() {
	//
	// Returns an associative array of Parcel Attributes
	//
	fcapParcelObj = null;
   	capParcelResult = aa.parcel.getParcelandAttribute(capId, null);
   	if (capParcelResult.getSuccess())
   		fcapParcelObj = capParcelResult.getOutput().toArray();
   	else
     		debug+="ERROR: Failed to get Parcel object: " + capParcelResult.getErrorType() + ":" + capParcelResult.getErrorMessage() + br;
  	
  	for (i in fcapParcelObj)
  		{
  		parcelAttrObj = fcapParcelObj[i].getParcelAttribute().toArray();
  		for (z in parcelAttrObj)
  			{
			AInfo["ParcelAttribute." + parcelAttrObj[z].getB1AttributeName()]=parcelAttrObj[z].getB1AttributeValue();
			debug+="{" + "ParcelAttribute." + parcelAttrObj[z].getB1AttributeName() + "} = " + parcelAttrObj[z].getB1AttributeValue() + br;
			}
  		}
	}

 
 function loadTaskSpecific() {
 	// 
 	// Appends the Task Specific Info to App Specific Array
 	//
 
 	var workflowResult = aa.workflow.getTasks(capId);
 	if (workflowResult.getSuccess())
 		wfObj = workflowResult.getOutput();
 	else
 		{ message+="ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage() + br; return false; }
 
 	for (i in wfObj)
 		{
 		fTask = wfObj[i];
 		stepnumber = fTask.getStepNumber();
 		processID = fTask.getProcessID();
 		TSIResult = aa.taskSpecificInfo.getTaskSpecificInfoByTask(capId, processID, stepnumber)
 		if (TSIResult.getSuccess())
 			{
 			TSI = TSIResult.getOutput();
 			for (a1 in TSI)
  				{
  				if (useTaskSpecificGroupName)
  	  				{
  	  				AInfo[TSI[a1].getGroupCode() + "." + TSI[a1].getCheckboxDesc()] = TSI[a1].getChecklistComment();
  					debug+="{" + TSI[a1].getGroupCode() + "." + TSI[a1].getCheckboxDesc() + "} = " + TSI[a1].getChecklistComment() + br;
  					}
  	  			else
					{
	  				AInfo[TSI[a1].getCheckboxDesc()] = TSI[a1].getChecklistComment();
	  				debug+="{" + TSI[a1].getCheckboxDesc() + "} = " + TSI[a1].getChecklistComment() + br;
	  				}
				}
 			}
 		}
}
  
function getCapId()  {

    var s_id1 = aa.env.getValue("PermitId1");
    var s_id2 = aa.env.getValue("PermitId2");
    var s_id3 = aa.env.getValue("PermitId3");

    var s_capResult = aa.cap.getCapID(s_id1, s_id2, s_id3);
    if(s_capResult.getSuccess())
      return s_capResult.getOutput();
    else
    {
      debug+="ERROR: Failed to get capId: " + s_capResult.getErrorMessage() + br;
      return null;
    }
  }

// 
// matches:  returns true if value matches any of the following arguments
//
function matches(eVal,argList) {
   for (var i=1; i<arguments.length;i++)  
   	if (arguments[i] == eVal)
   		return true;

}  
//
// exists:  return true if Value is in Array
//
function exists(eVal, eArray) {
	  for (ii in eArray) 
	  	if (eArray[ii] == eVal) return true;
	  return false;
}

//
// Get the standard choices domain for this application type
//
function getScriptAction(strControl) 
	{
	var actArray = new Array();
		
	for (var count=1; count < 99; count++)  // Must be sequential from 01 up to 99
		{
		var countstr = count < 10 ? "0" + count : count;
		var bizDomScriptResult = aa.bizDomain.getBizDomainByValue(strControl,countstr);
	   	
	   	if (bizDomScriptResult.getSuccess())
	   		{
			bizDomScriptObj = bizDomScriptResult.getOutput();
			var myObj= new pairObj(bizDomScriptObj.getBizdomainValue());
			myObj.load(bizDomScriptObj.getDescription());
			if (bizDomScriptObj.getAuditStatus() == 'I') myObj.enabled = false;
			actArray.push(myObj);
			}
		else
			{
			break;
			}
		}
	return actArray;
	}
	
function doStandardChoiceActions(stdChoiceEntry,doExecution,docIndent) 
	{
	var thisDate = new Date();
	var thisTime = thisDate.getTime();
	debug+="Executing: " + stdChoiceEntry + ", Elapsed Time: "  + ((thisTime - startTime) / 1000) + " Seconds" + br;
	
	var pairObjArray = getScriptAction(stdChoiceEntry);
	if (!doExecution) docWrite(stdChoiceEntry,true,docIndent);
	for (xx in pairObjArray)
		{
		doObj = pairObjArray[xx];
		if (doExecution && doObj.enabled)
			{
			if (eval(token(doObj.cri)))
				{
				debug+="TRUE: " + doObj.cri + br;
				eval(token(doObj.act));
				}
			}
		else // just document
			{
			docWrite("|  ",false,docIndent);
			if (!doObj.enabled) docWrite("|  " + doObj.ID + " DISABLED!",false,docIndent);
			docWrite("|  " + doObj.ID + " criteria: " + doObj.cri,false,docIndent);
			docWrite("|  " + doObj.ID + " action  : " + doObj.act,false,docIndent);
			
			for (yy in doObj.branch)
				{
				doStandardChoiceActions(doObj.branch[yy],false,docIndent+1);
				}
			}
		} // next sAction
	if (!doExecution) docWrite(null,true,docIndent);
	var thisDate = new Date();
	var thisTime = thisDate.getTime();
	debug+="Finished: " + stdChoiceEntry + ", Elapsed Time: "  + ((thisTime - startTime) / 1000) + " Seconds" + br;
	}	

function docWrite(dstr,header,indent)
	{
	var istr = "";
	for (i = 0 ; i < indent ; i++)
		istr+="|  ";
	if (header && dstr)
		aa.print(istr + "------------------------------------------------");
	if (dstr) aa.print(istr + dstr);
	if (header)
		aa.print(istr + "------------------------------------------------");
	}
	
	
function token(tstr)
	{
	if (!disableTokens)
		{
		re = new RegExp("\\{","g") ; tstr = String(tstr).replace(re,"AInfo[\"");
		re = new RegExp("\\}","g") ; tstr = String(tstr).replace(re,"\"]");
		}
	return String(tstr);
  	}
  	
function pairObj(actID)
	{
	this.ID = actID;
	this.cri = null;
	this.act = null;
	this.enabled = true;
	this.branch = new Array();
	
	this.load = function(loadStr) { 
		//
		// load() : tokenizes and loades the criteria and action
		//
		loadArr = loadStr.split("\\^");
		if (loadArr.length != 2)
			{
			debug+="ERROR: The following Criteria/Action pair is incorrectly formatted.  Two elements separated by a caret (\"^\") are required. " + br + br + loadStr + br;
			}
		else
			{
			this.cri = loadArr[0];
			this.act = loadArr[1];
			
			var a = loadArr[1];
			var bb = a.indexOf("branch");
			while (bb >= 0)
			  {
			  var cc = a.substring(bb);
			  var dd = cc.indexOf("\")");
			  this.branch.push(cc.substring(8,dd));
			  a = cc.substring(dd);
			  bb = a.indexOf("branch");
			  }
			  
			}
		}
	}	
	
function convertAADateToJava(myDate) {

	// takes an AA date and converts it to Javascript Date object
	// if we have a two digit year, assume that 00-79 is 2000 to 2079
	// assume that 80-99 is 1980 to 1999

	var mmonth = myDate.getMonth();
        var yyear = myDate.getYear();
        var dday = myDate.getDayOfMonth();
        var now = new Date();
        var firsttwo = (now.getFullYear() - (now.getFullYear() % 100))
        if (yyear < 80 )
        	yyear+=firsttwo;
        if (yyear >= 80 && yyear < 100) // guess that this is 1900
                yyear+=1900;

	var newDate = new Date(yyear,mmonth-1,dday);
	return newDate
}

/*------------------------------------------------------------------------------------------------------/
| <===========External Functions (used by Action entries)
/------------------------------------------------------------------------------------------------------*/

function activateTask(wfstr) // optional process name
	{
	var useProcess = false;
	var processName = "";
	if (arguments.length == 2) 
		{
		processName = arguments[1]; // subprocess
		useProcess = true;
		}

	var workflowResult = aa.workflow.getTasks(capId);
 	if (workflowResult.getSuccess())
  	 	wfObj = workflowResult.getOutput();
  	else
  	  	{ message+="ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage() + br; return false; }
	
	for (i in wfObj)
		{
   		fTask = wfObj[i];
 		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase())  && (!useProcess || fTask.getProcessCode().equals(processName)))
			{
			stepnumber = fTask.getStepNumber();
			processID = fTask.getProcessID();

			if (useProcess)
				aa.workflow.adjustTask(capId, stepnumber, processID, "Y", "N", null, null)
			else
				aa.workflow.adjustTask(capId, stepnumber, "Y", "N", null, null)

			message+="Activating Workflow Task: " + wfstr + br;
			debug+="Activating Workflow Task: " + wfstr + br;
			}			
		}
	}

function addAllFees(fsched,fperiod,fqty,finvoice) // Adds all fees for a given fee schedule
	{
	var arrFees = aa.finance.getFeeItemList(null,fsched,null).getOutput();
	for (xx in arrFees)
		{
		var feeCod = arrFees[xx].getFeeCod();
		assessFeeResult = aa.finance.createFeeItem(capId,fsched,feeCod,fperiod,fqty);
		if (assessFeeResult.getSuccess())
			{
			feeSeq = assessFeeResult.getOutput();
			message+="Added Fee " + feeCod + ", Qty " + fqty + br;
			debug+="The assessed fee Sequence Number " + feeSeq + br;
			if (finvoice == "Y")
			{
				feeSeqList.push(feeSeq);
				paymentPeriodList.push(fperiod);
				}
			}
		else
			{
			debug+= "ERROR: assessing fee (" + feeCod + "): " + assessFeeResult.getErrorMessage() + br;
			}
		} // for xx
	} // function

function addAppCondition(cType,cStatus,cDesc,cComment,cImpact)
	{
	var addCapCondResult = aa.capCondition.addCapCondition(capId, cType, cDesc, cComment, sysDate, null, sysDate, null,null, cImpact, systemUserObj, systemUserObj, cStatus, currentUserID, "A")
        if (addCapCondResult.getSuccess())
        	{
		message+="Successfully added condition (" + cImpact + ") " + cDesc + br;
		debug+="Successfully added condition (" + cImpact + ") " + cDesc + br;
		}
	else
		{
		debug+= "ERROR: adding condition (" + cImpact + "): " + addCapCondResult.getErrorMessage() + br;
		}
	}

function addFee(fcode,fsched,fperiod,fqty,finvoice) // Adds a single fee
	{
	assessFeeResult = aa.finance.createFeeItem(capId,fsched,fcode,fperiod,fqty);
	if (assessFeeResult.getSuccess())
		{
		feeSeq = assessFeeResult.getOutput();
		message+="Successfully added Fee " + fcode + ", Qty " + fqty + br;
		debug+="The assessed fee Sequence Number " + feeSeq + br;
		if (finvoice == "Y")
			{
			feeSeqList.push(feeSeq);
			paymentPeriodList.push(fperiod);
			}
		}
	else
		{
		debug+= "ERROR: assessing fee (" + fcode + "): " + assessFeeResult.getErrorMessage() + br;
		}
	}

function addParent(parentAppNum) 
//
// adds the current application to the parent
//
	{
	getCapResult = aa.cap.getCapID(parentAppNum);
	if (getCapResult.getSuccess())
		{
		parentId = getCapResult.getOutput();
		linkResult = aa.cap.createAppHierarchy(parentId, capId);
		if (linkResult.getSuccess())
			debug+="Successfully linked to Parent Application : " + parentAppNum + br;
		else
			debug+= "ERROR: linking to parent application parent cap id (" + parentAppNum + "): " + linkResult.getErrorMessage() + br;
		}
	else
		{ debug+= "ERROR: getting parent cap id (" + parentAppNum + "): " + getCapResult.getErrorMessage() + br }
	}
			

function appMatch(ats) 
	{
	var isMatch = true;
	var ata = ats.split("/");
	if (ata.length != 4)
		debug+="ERROR in appMatch.  The following Application Type String is incorrectly formatted: " + ats + br;
	else
		for (xx in ata)
			if (!ata[xx].equals(appTypeArray[xx]) && !ata[xx].equals("*"))
				isMatch = false;
	return isMatch;
	}	

function branch(stdChoice)
	{
	doStandardChoiceActions(stdChoice,true,0);
	}

function branchTask(wfstr,wfstat,wfcomment,wfnote) // optional process name
	{
	var useProcess = false;
	var processName = "";
	if (arguments.length == 5) 
		{
		processName = arguments[4]; // subprocess
		useProcess = true;
		}

	var workflowResult = aa.workflow.getTasks(capId);
 	if (workflowResult.getSuccess())
  	 	wfObj = workflowResult.getOutput();
  	else
  	  	{ message+="ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage() + br; return false; }
	
	if (!wfstat) wfstat = "NA";
	
	for (i in wfObj)
		{
   		fTask = wfObj[i];
 		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase())  && (!useProcess || fTask.getProcessCode().equals(processName)))
			{
			dispositionDate = aa.date.getCurrentDate();
			stepnumber = fTask.getStepNumber();
			processID = fTask.getProcessID();

			if (useProcess)
				aa.workflow.handleDisposition(capId,stepnumber,processID,wfstat,dispositionDate, wfnote,wfcomment,systemUserObj ,"B");
			else
				aa.workflow.handleDisposition(capId,stepnumber,wfstat,dispositionDate, wfnote,wfcomment,systemUserObj ,"B");
			
			message+="Closing Workflow Task: " + wfstr + " with status " + wfstat + ", Branching..." + br;
			debug+="Closing Workflow Task: " + wfstr + " with status " + wfstat + ", Branching..." + br;
			}			
		}
	}

function closeTask(wfstr,wfstat,wfcomment,wfnote) // optional process name
	{
	var useProcess = false;
	var processName = "";
	if (arguments.length == 5) 
		{
		processName = arguments[4]; // subprocess
		useProcess = true;
		}

	var workflowResult = aa.workflow.getTasks(capId);
 	if (workflowResult.getSuccess())
  	 	wfObj = workflowResult.getOutput();
  	else
  	  	{ message+="ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage() + br; return false; }
	
	if (!wfstat) wfstat = "NA";
	
	for (i in wfObj)
		{
   		fTask = wfObj[i];
 		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase())  && (!useProcess || fTask.getProcessCode().equals(processName)))
			{
			dispositionDate = aa.date.getCurrentDate();
			stepnumber = fTask.getStepNumber();
			processID = fTask.getProcessID();

			if (useProcess)
				aa.workflow.handleDisposition(capId,stepnumber,processID,wfstat,dispositionDate, wfnote,wfcomment,systemUserObj ,"Y");
			else
				aa.workflow.handleDisposition(capId,stepnumber,wfstat,dispositionDate, wfnote,wfcomment,systemUserObj ,"Y");
			
			message+="Closing Workflow Task: " + wfstr + " with status " + wfstat + br;
			debug+="Closing Workflow Task: " + wfstr + " with status " + wfstat + br;
			}			
		}
	}


function comment(cstr)
	{
	if (showDebug) debug+=cstr + br;
	if (showMessage) message+=cstr + br;
	}
	
function copyAppSpecific(newCap) // copy all App Specific info into new Cap
	{
	for (asi in AInfo)
	  	editAppSpecific(asi,AInfo[asi],newCap)
	}

function copyConditions(fromCapId)
	{
	getFromCondResult = aa.capCondition.getCapConditions(fromCapId);
	if (getFromCondResult.getSuccess())
		condA = getFromCondResult.getOutput();
	else
		{ debug+= "ERROR: getting cap conditions: " + getFromCondResult.getErrorMessage() + br ; return false}
		
	for (cc in condA)
		{
		thisC = condA[cc];
		
		var addCapCondResult = aa.capCondition.addCapCondition(capId, thisC.getConditionType(), thisC.getConditionDescription(), thisC.getConditionComment(), thisC.getEffectDate(), thisC.getExpireDate(), sysDate, thisC.getRefNumber1(),thisC.getRefNumber2(), thisC.getImpactCode(), thisC.getIssuedByUser(), thisC.getStatusByUser(), thisC.getConditionStatus(), currentUserID, "A")
		if (addCapCondResult.getSuccess())
			debug+="Successfully added condition (" +  thisC.getImpactCode() + ") " +  thisC.getConditionDescription() + br;
		else
			debug+= "ERROR: adding condition (" + cImpact + "): " + addCapCondResult.getErrorMessage() + br;
		}
	}

function copyParcelGisObjects() 
	{
	var capParcelResult = aa.parcel.getParcelandAttribute(capId,null);
	if (capParcelResult.getSuccess())
		{
		var Parcels = capParcelResult.getOutput().toArray();
		for (zz in Parcels)
			{
			ParcelValidatedNumber = Parcels[zz].getParcelNumber();
			debug+="Looking at parcel " + ParcelValidatedNumber;
			gisObjResult = aa.gis.getParcelGISObjects(ParcelValidatedNumber); // get gis objects on the parcel number
			if (gisObjResult.getSuccess()) 	
				fGisObj = gisObjResult.getOutput();
			else
				{ debug+="ERROR: Getting GIS objects for Parcel.  Reason is: " + gisObjResult.getErrorType() + ":" + gisObjResult.getErrorMessage() ; return false }

			for (a1 in fGisObj) // for each GIS object on the Cap
				{
				var gisTypeScriptModel = fGisObj[a1];
                                gisObjArray = gisTypeScriptModel.getGISObjects()
                                for (b1 in gisObjArray)
                                	{
  					var gisObjScriptModel = gisObjArray[b1];
  					var gisObjModel = gisObjScriptModel.getGisObjectModel() ;

					retval = aa.gis.addCapGISObject(capId,gisObjModel.getServiceID(),gisObjModel.getLayerId(),gisObjModel.getGisId());

					if (retval.getSuccess())
						{ debug+="Successfully added Cap GIS object: " + gisObjModel.getGisId() + br}
					else
						{ debug+="ERROR: Could not add Cap GIS Object.  Reason is: " + retval.getErrorType() + ":" + retval.getErrorMessage() ; return false }	
					}
				}
			}
		}	
	else
		{ debug+="ERROR: Getting Parcels from Cap.  Reason is: " + capParcelResult.getErrorType() + ":" + capParcelResult.getErrorMessage() ; return false }
	}

function countApps()
	// Returns the number of applications that meet the following criteria:
	//    Same address (looks at first address only)
	//    Same Contact First and Last Name (looks at first contact only)
	//    Falls within the same calendar year
	//    Same application type
	{
	var county = 0;
	
	// get address data
	addResult = aa.address.getAddressByCapId(capId);
	if (addResult.getSuccess())
		{ aoArray = addResult.getOutput(); }
	else	
		{ debug+= "ERROR: getting address by cap ID: " + addResult.getErrorMessage() + br; return false; }
	
	if (aoArray.length)
		{ ao = aoArray[0]; }
	else
		{ debug+= "WARNING: no address for comparison:" ; return false; }
	
	// get caps with same address
	capAddResult = aa.cap.getCapListByDetailAddress(ao.getStreetName(),ao.getHouseNumberStart(),ao.getStreetSuffix(),ao.getZip(),ao.getStreetDirection(),null);
	if (capAddResult.getSuccess())
	 	{ var capIdArray=capAddResult.getOutput(); }
	else
	 	{ debug+= "ERROR: getting similar addresses: " + capAddResult.getErrorMessage() + br;  return false; }
	
	// cap contact
	capContResult = aa.people.getCapContactByCapID(capId);
	if (capContResult.getSuccess())
		{ conArr = capContResult.getOutput();  }
	else
		{ debug+= "ERROR: getting cap contact: " + capAddResult.getErrorMessage() + br; return false; }
		
	if (conArr.length)
		{ con = conArr[0]; }
	else
		{ debug+= "WARNING: no contact for comparison:" ; return false; }
		
	
	var todayy = new Date();
	var yearstr = todayy.getFullYear();
	var testdate = new Date("1/1/" + yearstr);
	
	// loop through related caps
	for (cappy in capIdArray)
		{
		// get file date
		relcap = aa.cap.getCap(capIdArray[cappy].getCapID()).getOutput();
		relcapdate = convertAADateToJava(relcap.getFileDate());
		
		// get cap type
		
		reltype = relcap.getCapType().toString();

		// get related cap contact for comparison
		capContResult = aa.people.getCapContactByCapID(capIdArray[cappy].getCapID());
		if (capContResult.getSuccess())
			{ relconArr = capContResult.getOutput(); }
		else
			{ debug+= "ERROR: getting similar contact: " + capContResult.getErrorMessage() + br; return false }

		if (relconArr.length) // only do comparison if there is a contact on related cap
			{ 
			relcon = relconArr[0]; 
			
			// comparison:  app types, filedate is in calendar year and first & last names match
			
			//debug+= "Comparing: app types " + appTypeString + " == " + reltype + br;
			//debug+= "Comparing: dates " + relcapdate + " >= " + testdate + br;
			
			if (appTypeString.equals(reltype) && relcapdate >= testdate && relcon.getLastName().toUpperCase().equals(con.getLastName().toUpperCase()) && relcon.getFirstName().toUpperCase().equals(con.getFirstName().toUpperCase()))
				{
				county++
				}
			} // array length
		} // loop through related caps
	return county;
	}

function createChild(grp,typ,stype,cat,desc) 
//
// creates the new application and returns the capID object
//
	{

	debug +=" here " ;
	var appCreateResult = aa.cap.createApp(grp,typ,stype,cat,desc);
	
	debug+="creating cap " + grp + "/" + typ + "/" + stype + "/" + cat + br;
	if (appCreateResult.getSuccess())
		{
		var newId = appCreateResult.getOutput();
		debug+="cap " + grp + "/" + typ + "/" + stype + "/" + cat + " created successfully " + br;
		var newObj = aa.cap.getCap(newId).getOutput();	//Cap object
		result = aa.cap.createAppHierarchy(capId, newId); 
		if (result.getSuccess())
			debug+="Child application successfully linked" + br;
		else
			debug+="Could not link applications" + br;

/* Get Licenses Prof  -- Work in progress
			capLicenseResult = aa.licenseScript.getLicenseProf(capId);
			if (capLicenseResult.getSuccess())
				{
				License = capLicenseResult.getOutput();
				for (yy in License)
					{
					newLicense = aa.licenseScript.createLicenseScriptModel();
					newLicense.
*/
		// Copy Parcels

		var capParcelResult = aa.parcel.getParcelandAttribute(capId,null);
		if (capParcelResult.getSuccess())
			{
			var Parcels = capParcelResult.getOutput().toArray();
			for (zz in Parcels)
				{
				debug+="adding parcel #" + zz + " = " + Parcels[zz].getParcelNumber() + br;
				var newCapParcel = aa.parcel.getCapParcelModel().getOutput();
				newCapParcel.setParcelModel(Parcels[zz]);
				newCapParcel.setCapIDModel(newId);
				newCapParcel.setL1ParcelNo(Parcels[zz].getParcelNumber());
				newCapParcel.setParcelNo(Parcels[zz].getParcelNumber());
				aa.parcel.createCapParcel(newCapParcel);
				}
			}



		// Copy Contacts
		capContactResult = aa.people.getCapContactByCapID(capId);
		if (capContactResult.getSuccess())
			{
			Contacts = capContactResult.getOutput();
			for (yy in Contacts)
				{
				var newContact = Contacts[yy].getCapContactModel();
				newContact.setCapID(newId);
				aa.people.createCapContact(newContact);
				debug+="added contact" + br;
				}
			}	

		// Copy Addresses
		capAddressResult = aa.address.getAddressByCapId(capId);
		if (capAddressResult.getSuccess())
			{
			Address = capAddressResult.getOutput();
			for (yy in Address)
				{
				newAddress = Address[yy];
				newAddress.setCapID(newId);
				aa.address.createAddress(newAddress);
				debug+="added address" + br;
				}
			}
		
		return newId;
		}
	else
		{
		debug+= "ERROR: adding child App: " + appCreateResult.getErrorMessage() + br;
		}
	}

function dateAdd(td,amt) 
// perform date arithmetic on a string 
// td can be "mm/dd/yyyy" (or any string that will convert to JS date)
// amt can be positive or negative (5, -3) days 
	{
	if (!td) 
		dDate = new Date();
	else
		dDate = new Date(td);
	
        aa.print(dDate.getTime());
	dDate.setTime(dDate.getTime() + (1000 * 60 * 60 * 24 * amt));
	return (dDate.getMonth()+1) + "/" + dDate.getDate() + "/" + dDate.getFullYear();
	}

function editAppSpecific(itemName,itemValue)  // optional: itemCap
	{
	var updated = false;
	var i=0;
	itemCap = capId;
	if (arguments.length == 3) itemCap = arguments[2]; // use cap ID specified in args
   	
    	var appSpecInfoResult = aa.appSpecificInfo.getByCapID(itemCap);
	if (appSpecInfoResult.getSuccess())
	 	{
		var appspecObj = appSpecInfoResult.getOutput();
		
		if (itemName != "")
			{
				while (i < appspecObj.length && !updated)
				{
					if (appspecObj[i].getCheckboxDesc() == itemName)
					{
						appspecObj[i].setChecklistComment(itemValue);
						actionResult = aa.appSpecificInfo.editAppSpecInfos(appspecObj);
						if (actionResult.getSuccess()) {
							message += "app spec info item " + itemName + " has been given a value of " + itemValue + br;
							debug += "app spec info item " + itemName + " has been given a value of " + itemValue + br;
						} else {
							debug += "ERROR: Setting the app spec info item " + itemName + " to " + itemValue + " .\nReason is: " +   actionResult.getErrorType() + ":" + actionResult.getErrorMessage();
						}
						updated = true;
						AInfo[itemName] = itemValue;  // Update array used by this script
					}
					i++;
				} // while loop
			} // item name blank
		} // got app specific object	
	} // function
	
	function editTaskDueDate(wfstr,wfdate) // optional process name
		{
		var useProcess = false;
		var processName = "";
		if (arguments.length == 2) 
			{
			processName = arguments[1]; // subprocess
			useProcess = true;
			}
	
		var workflowResult = aa.workflow.getTasks(capId);
	 	if (workflowResult.getSuccess())
	  	 	wfObj = workflowResult.getOutput();
	  	else
	  	  	{ message+="ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage() + br; return false; }
		
		for (i in wfObj)
			{
	   		fTask = wfObj[i];
	  		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase())  && (!useProcess || fTask.getProcessCode().equals(processName)))
				{
				wfObj[i].setDueDate(aa.date.parseDate(wfdate));
				fTaskModel = wfObj[i].getTaskItem();
				tResult = aa.workflow.adjustTaskWithNoAudit(fTaskModel);
				if (tResult.getSuccess())
					debug+="Set Workflow: " + wfstr + " due Date " + wfdate + br;
			  	else
		  	  		{ message+="ERROR: Failed to update due date on workflow: " + tResult.getErrorMessage() + br; return false; }
				}			
			}
		}
	
function editTaskSpecific(wfName,itemName,itemValue)  // optional: itemCap
	{
	var updated = false;
	var i=0;
	itemCap = capId;
	if (arguments.length == 4) itemCap = arguments[3]; // use cap ID specified in args
	//
 	// Get the workflows
 	//
 	var workflowResult = aa.workflow.getTasks(itemCap);
 	if (workflowResult.getSuccess())
 		wfObj = workflowResult.getOutput();
 	else
 		{ debug+="ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage() + br; return false; }
 
 	// 
 	// Loop through workflow tasks
 	//
 	for (i in wfObj)
 		{
 		fTask = wfObj[i];
 		stepnumber = fTask.getStepNumber();
 		processID = fTask.getProcessID();
 		if (wfName.equals(fTask.getTaskDescription())) // Found the right Workflow Task
 			{
  			TSIResult = aa.taskSpecificInfo.getTaskSpecifiInfoByDesc(itemCap,processID,stepnumber,itemName)
 			if (TSIResult.getSuccess())
 				{
	 			TSI = TSIResult.getOutput();
				var TSIArray = new Array();
				TSInfoModel = TSI.getTaskSpecificInfoModel();
				TSInfoModel.setChecklistComment(itemValue);
				TSIArray.push(TSInfoModel);
				TSIUResult = aa.taskSpecificInfo.editTaskSpecInfos(TSIArray);
				if (TSIUResult.getSuccess())
					{
					debug+="Successfully updated TSI Task=" + wfName + " Item=" + itemName + " Value=" + itemValue + br;
					AInfo[itemName] = itemValue;  // Update array used by this script
					}
				else
					{ debug+="ERROR: Failed to Update Task Specific Info : " + TSIUResult.getErrorMessage() + br; return false; }
	 			}
	 		else
	 			{
	 			debug+="ERROR: Failed to get Task Specific Info objects: " + TSIUResult.getErrorMessage() + br; 
	 			return false; 
	 			}
	 		}  // found workflow task
		} // each task	
	}
	
function emailContact(mSubj,mText)   // optional: Contact Type, default Applicant
	{
	var replyTo = "noreply@accela.com";
	var contactType = "Applicant"
	var emailAddress = "";
	
	if (arguments.length == 3) contactType = arguments[2]; // use contact type specified
   	
	capContactResult = aa.people.getCapContactByCapID(capId);
	if (capContactResult.getSuccess())
		{
		Contacts = capContactResult.getOutput();
		for (yy in Contacts)
			if (contactType.equals(Contacts[yy].getCapContactModel().getPeople().getContactType()))
				if (Contacts[yy].getEmail() != null)
					emailAddress = Contacts[yy].getEmail();
		}	

	if (emailAddress.length) 
		{
		aa.sendMail(replyTo, emailAddress, "", mSubj, mText);
		debug+="Successfully sent email to " + contactType + br;
		}
	else
		debug+="Couldn't send email to " + contactType + ", no email address" + br;
	}function feeExists(feestr)
	{
	feeResult=aa.fee.getFeeItems(capId);
	if (feeResult.getSuccess())
		{ feeObjArr = feeResult.getOutput(); }
	else
		{ debug+= "ERROR: getting fee items: " + capContResult.getErrorMessage() + br; return false }
	
	for (ff in feeObjArr)
		if (feestr.equals(feeObjArr[ff].getFeeCod()))
			return true;
			
	return false;
	}

function getApplication(appNum) 
//
// returns the capId object of an application
//
	{
	getCapResult = aa.cap.getCapID(appNum);
	if (getCapResult.getSuccess())
		{
		parentId = getCapResult.getOutput();
		return parentId;
		}
	else
		{ debug+= "ERROR: getting cap id (" + appNum + "): " + getCapResult.getErrorMessage() + br }
	}

function getAppSpecific(itemName)  // optional: itemCap
	{
	var updated = false;
	var i=0;
	itemCap = capId;
	if (arguments.length == 2) itemCap = arguments[1]; // use cap ID specified in args
   	
    	var appSpecInfoResult = aa.appSpecificInfo.getByCapID(itemCap);
	if (appSpecInfoResult.getSuccess())
	 	{
		var appspecObj = appSpecInfoResult.getOutput();
		
		if (itemName != "")
			{
			for (i in appspecObj)
				if (appspecObj[i].getCheckboxDesc() == itemName)
					{
					return appspecObj[i].getChecklistComment();
					break;
					}
			} // item name blank
		} 
	else
		{ debug+= "ERROR: getting app specific info for Cap : " + appSpecInfoResult.getErrorMessage() + br }
	} // function

function isScheduled(inspType)
	{
	var found = false;
	var inspResultObj = aa.inspection.getInspections(capId);
	if (inspResultObj.getSuccess())
		{
		inspList = inspResultObj.getOutput();
		for (xx in inspList)
			if (String(inspType).equals(inspList[xx].getInspectionType()))
				found = true;
		}
	return found;
	}

function isTaskActive(wfstr) // optional process name
	{
	var useProcess = false;
	var processName = "";
	if (arguments.length == 2) 
		{
		processName = arguments[1]; // subprocess
		useProcess = true;
		}

	var workflowResult = aa.workflow.getTasks(capId);
 	if (workflowResult.getSuccess())
  	 	wfObj = workflowResult.getOutput();
  	else
  	  	{ message+="ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage() + br; return false; }
	
	for (i in wfObj)
		{
   		fTask = wfObj[i];
 		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase())  && (!useProcess || fTask.getProcessCode().equals(processName)))
			if (fTask.getActiveFlag().equals("Y"))
				return true;
			else
				return false;
		}
	}

function isTaskComplete(wfstr) // optional process name
	{
	var useProcess = false;
	var processName = "";
	if (arguments.length == 2) 
		{
		processName = arguments[1]; // subprocess
		useProcess = true;
		}

	var workflowResult = aa.workflow.getTasks(capId);
 	if (workflowResult.getSuccess())
  	 	wfObj = workflowResult.getOutput();
  	else
  	  	{ message+="ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage() + br; return false; }
	
	for (i in wfObj)
		{
   		fTask = wfObj[i];
 		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase())  && (!useProcess || fTask.getProcessCode().equals(processName)))
			if (fTask.getCompleteFlag().equals("Y"))
				return true;
			else
				return false;
		}
	}
	
function lookup(stdChoice,stdValue) 
	{
	var strControl;
	var bizDomScriptResult = aa.bizDomain.getBizDomainByValue(stdChoice,stdValue);
	
   	if (bizDomScriptResult.getSuccess())
   		{
		bizDomScriptObj = bizDomScriptResult.getOutput();
		var strControl = "" + bizDomScriptObj.getDescription(); // had to do this or it bombs.  who knows why?
		debug+="getStandardChoice(" + stdChoice + "," + stdValue + ") = " + strControl + br;
		}
	else
		{
		debug+="getStandardChoice(" + stdChoice + "," + stdValue + ") does not exist" + br;
		}
	return strControl;
	}

function loopTask(wfstr,wfstat,wfcomment,wfnote) // optional process name
	{
	var useProcess = false;
	var processName = "";
	if (arguments.length == 5) 
		{
		processName = arguments[4]; // subprocess
		useProcess = true;
		}

	var workflowResult = aa.workflow.getTasks(capId);
 	if (workflowResult.getSuccess())
  	 	wfObj = workflowResult.getOutput();
  	else
  	  	{ message+="ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage() + br; return false; }
	
	if (!wfstat) wfstat = "NA";
	
	for (i in wfObj)
		{
   		fTask = wfObj[i];
 		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase())  && (!useProcess || fTask.getProcessCode().equals(processName)))
			{
			dispositionDate = aa.date.getCurrentDate();
			stepnumber = fTask.getStepNumber();
			processID = fTask.getProcessID();

			if (useProcess)
				aa.workflow.handleDisposition(capId,stepnumber,processID,wfstat,dispositionDate, wfnote,wfcomment,systemUserObj ,"L");
			else
				aa.workflow.handleDisposition(capId,stepnumber,wfstat,dispositionDate, wfnote,wfcomment,systemUserObj ,"L");
			
			message+="Closing Workflow Task: " + wfstr + " with status " + wfstat + ", Looping..." + br;
			debug+="Closing Workflow Task: " + wfstr + " with status " + wfstat + ", Looping..." + br;
			}			
		}
	}

function proximity(svc,layer,numDistance)  // optional: distanceType
	{
	// returns true if the app has a gis object in proximity
	//

	var distanceType = "feet"
	if (arguments.length == 4) distanceType = arguments[3]; // use distance type in arg list
   	
	bufferTargetResult = aa.gis.getGISType(svc,layer); // get the buffer target
	if (bufferTargetResult.getSuccess())
		{
		buf = bufferTargetResult.getOutput();
		buf.addAttributeName(layer + "_ID");
		}
	else
		{ debug+="ERROR: Getting GIS Type for Buffer Target.  Reason is: " + bufferTargetResult.getErrorType() + ":" + bufferTargetResult.getErrorMessage() ; return false }
			
	gisObjResult = aa.gis.getCapGISObjects(capId); // get gis objects on the cap
	if (gisObjResult.getSuccess()) 	
		fGisObj = gisObjResult.getOutput();
	else
		{ debug+="ERROR: Getting GIS objects for Cap.  Reason is: " + gisObjResult.getErrorType() + ":" + gisObjResult.getErrorMessage() ; return false }

	for (a1 in fGisObj) // for each GIS object on the Cap
		{
		bufchk = aa.gis.getBufferByRadius(fGisObj[a1], numDistance, distanceType, buf);

		if (bufchk.getSuccess())
			proxArr = bufchk.getOutput();
		else
			{ debug+="ERROR: Retrieving Buffer Check Results.  Reason is: " + bufchk.getErrorType() + ":" + bufchk.getErrorMessage() ; return false }	
		
		for (a2 in proxArr)
			{
			proxObj = proxArr[a2].getGISObjects();  // if there are GIS Objects here, we're done
			if (proxObj.length) 
				{
				return true;
				}
			}
		}
	}

function scheduleInspectDate(iType,DateToSched) // optional inspector ID.  This function requires dateAdd function
	{
	var inspectorObj = null;
	if (arguments.length == 3) 
		{
		inspRes = aa.person.getUser(arguments[2])
		if (inspRes.getSuccess())
			inspectorObj = inspRes.getOutput();
		}

	var schedRes = aa.inspection.scheduleInspection(capId, inspectorObj, aa.date.parseDate(DateToSched), null, iType, "Scheduled via Script")
	
	if (schedRes.getSuccess())
		debug+="Successfully scheduled inspection : " + iType + " for " + DateToSched + br;
	else
		debug+= "ERROR: adding scheduling inspection (" + iType + "): " + schedRes.getErrorMessage() + br;
	}

function scheduleInspection(iType,DaysAhead) // optional inspector ID.  This function requires dateAdd function
	{
	var inspectorObj = null;
	if (arguments.length == 3) 
		{
		inspRes = aa.person.getUser(arguments[2])
		if (inspRes.getSuccess())
			inspectorObj = inspRes.getOutput();
		}

	var schedRes = aa.inspection.scheduleInspection(capId, inspectorObj, aa.date.parseDate(dateAdd(null,DaysAhead)), null, iType, "Scheduled via Script")
	
	if (schedRes.getSuccess())
		debug+="Successfully scheduled inspection : " + iType + " for " + dateAdd(null,DaysAhead) + br;
	else
		debug+= "ERROR: adding scheduling inspection (" + iType + "): " + schedRes.getErrorMessage() + br;
	}

function taskStatus(wfstr) // optional process name
	{
	var useProcess = false;
	var processName = "";
	if (arguments.length == 2) 
		{
		processName = arguments[1]; // subprocess
		useProcess = true;
		}

	var workflowResult = aa.workflow.getTasks(capId);
 	if (workflowResult.getSuccess())
  	 	wfObj = workflowResult.getOutput();
  	else
  	  	{ message+="ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage() + br; return false; }
	
	for (i in wfObj)
		{
   		fTask = wfObj[i];
 		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase())  && (!useProcess || fTask.getProcessCode().equals(processName)))
			return fTask.getDisposition()
		}
	}

function updateAppStatus(stat,cmt)
	{
	updateStatusResult = aa.cap.updateAppStatus(capId,"APPLICATION",stat, sysDate, cmt ,systemUserObj);
	if (updateStatusResult.getSuccess())
		debug+="Updated application status to " + stat + " successfully." + br;
	else
		debug+="ERROR: application status update to " + stat + " was unsuccessful.  The reason is "  + updateStatusResult.getErrorType() + ":" + updateStatusResult.getErrorMessage() + br;
	}

function updateFee(fcode,fsched,fperiod,fqty,finvoice) // Updates a fee with a new Qty.  If it doesn't exist, adds it
	{
	feeUpdated = false;
	getFeeResult = aa.finance.getFeeItemByFeeCode(capId,fcode,fperiod);
	if (getFeeResult.getSuccess())
		{	
		feeList = getFeeResult.getOutput();
		for (feeNum in feeList)
			if (feeList[feeNum].getFeeitemStatus().equals("NEW") && !feeUpdated)  // update this fee item
				{
				feeSeq = feeList[feeNum].getFeeSeqNbr();
				editResult = aa.finance.editFeeItemUnit(capId, fqty, feeSeq);
				feeUpdated = true;
				if (editResult.getSuccess())
					{
					debug+="Updated Qty on Existing Fee Item: " + fcode + " to Qty: " + fqty;
					//aa.finance.calculateFees(capId);
					if (finvoice == "Y")
						{
						feeSeqList.push(feeSeq);
						paymentPeriodList.push(fperiod);
						}
					}
				else
					{ debug+= "ERROR: updating qty on fee item (" + fcode + "): " + editResult.getErrorMessage() + br; break }
				}
		}		
	else
		{ debug+= "ERROR: getting fee items (" + fcode + "): " + getFeeResult.getErrorMessage() + br}
	
	if (!feeUpdated) // no existing fee, so update
		addFee(fcode,fsched,fperiod,fqty,finvoice);
	}


function updateParcelDistricts() {


	var fcapParcelObj = null;
	var capParcelResult = aa.parcel.getParcelandAttribute(capId, null);
	if (capParcelResult.getSuccess())
		var fcapParcelObj = capParcelResult.getOutput().toArray();
	else
	 		logDebug("**ERROR: Failed to get Parcel object: " + capParcelResult.getErrorType() + ":" + capParcelResult.getErrorMessage())
	
	for (i in fcapParcelObj)
	{
		var pNum = fcapParcelObj[i].getParcelNumber();
		
		parcelAttrObj = fcapParcelObj[i].getParcelAttribute().toArray();
		for (z in parcelAttrObj){
			var tAttr = parcelAttrObj[z].getB1AttributeName();
			var layer = null;
			var pfx = null;
			logDebug("Attribute: " + tAttr);
			if(tAttr == "ZONING INSP AREA"){
				layer = "Zoning_Insp_Areas";
			}
			else if(tAttr == "STREET INSP AREA"){
				layer = "Street_Cut_Insp_Areas";
			}
			else if(tAttr == "ELEC INSP AREA"){
				layer = "Electrical_Insp_Areas";
			}
			else if(tAttr == "MECH INSP AREA"){
				layer = "Gas_and_Mechanical_Insp_Areas";
			}
			else if(tAttr == "PLMG INSP AREA"){
				layer = "Plumbing_Insp_Areas";
			}
			else if(tAttr == "CNST INSP AREA"){
				layer = "Construction_Insp_Areas";
			}
			else if(tAttr == "SW INSP AREA"){
				layer = "Stormwater_Insp_Areas";
			}
			else if(tAttr == "SOIL ENG"){
				layer = "Soil_Engineer_Areas";
			}
			else if(tAttr == "BLDG INSP AREA"){
				layer = "Building_Insp_Areas";
			}
			else if(tAttr == "SIGN INSP AREA"){
				layer = "Sign_Insp_Areas";
			}
			else if(tAttr == "HIST INSP AREA"){
				layer = "Historic_Insp_Areas";				
			}
			else if(tAttr == "LANDSCAPING URBAN FORESTRY"){
				layer = "LandscapingUrbanForestry_Insp_Areas";				
			}
			else if(tAttr == "BONDS INSP AREA"){
				layer = "Bonds";				
			}
			else if(tAttr == "CODE INSP"){
				layer = "Code_Insp_Areas";				
			}

			if(layer != null){
				logDebug("Parcel: " + pNum + " layer: " + layer);
				var tmpValue = getGISInfo("Accela",layer,"CODE")
				logDebug("Value: " + tmpValue);
				if(tmpValue != null && tmpValue != false)
					parcelAttrObj[z].setB1AttributeValue(tmpValue);
			}
		}
		var tmpPar = aa.parcel.warpCapIdParcelModel2CapParcelModel(capId,fcapParcelObj[i]).getOutput();
		aa.parcel.updateDailyParcelWithAPOAttribute(tmpPar);
	}
}

function getGISInfo(svc,layer,attributename)
{
// use buffer info to get info on the current object by using distance 0
// usage: 
//
// x = getGISInfo("flagstaff","Parcels","LOT_AREA");
//

var distanceType = "feet";
var retString;
	
var bufferTargetResult = aa.gis.getGISType(svc,layer); // get the buffer target
if (bufferTargetResult.getSuccess())
	{
	var buf = bufferTargetResult.getOutput();
	buf.addAttributeName(attributename);
	}
else
	{ logDebug("**WARNING: Getting GIS Type for Buffer Target.  Reason is: " + bufferTargetResult.getErrorType() + ":" + bufferTargetResult.getErrorMessage()) ; return false }
		
var gisObjResult = aa.gis.getCapGISObjects(capId); // get gis objects on the cap
if (gisObjResult.getSuccess()) 	
	var fGisObj = gisObjResult.getOutput();
else
	{ logDebug("**WARNING: Getting GIS objects for Cap.  Reason is: " + gisObjResult.getErrorType() + ":" + gisObjResult.getErrorMessage()) ; return false }

for (a1 in fGisObj) // for each GIS object on the Cap.  We'll only send the last value
	{
	var bufchk = aa.gis.getBufferByRadius(fGisObj[a1], "0", distanceType, buf);

	if (bufchk.getSuccess())
		var proxArr = bufchk.getOutput();
	else
		{ logDebug("**WARNING: Retrieving Buffer Check Results.  Reason is: " + bufchk.getErrorType() + ":" + bufchk.getErrorMessage()) ; return false }	
	
	for (a2 in proxArr)
		{
		var proxObj = proxArr[a2].getGISObjects();  // if there are GIS Objects here, we're done
		for (z1 in proxObj)
			{
			var v = proxObj[z1].getAttributeValues()
			retString = v[0];
			}
		
		}
	}
return retString
}

function logDebug(vmsg){
	debug+=vmsg;
}