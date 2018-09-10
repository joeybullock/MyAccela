var myCapId = "BLD13-00024"
var myUserId = "ADMIN"


wfTask = "Permit Issuance"
wfStatus = "Issued"
wfComment = "";


/*
Common Events:
ApplicationSpecificInfoUpdateAfter
ApplicationSubmitAfter
WorkflowTaskUpdateAfter
*/

var runEvent = false; 							// set to false if you want to roll your own code here in script test
var controlString = "WorkflowTaskUpdateAfter";	// if runEvent is true, the standard choice to execute

/* master script code don't touch */ var tmpID = aa.cap.getCapID(myCapId).getOutput(); if(tmpID != null){aa.env.setValue("PermitId1",tmpID.getID1()); 	aa.env.setValue("PermitId2",tmpID.getID2()); 	aa.env.setValue("PermitId3",tmpID.getID3());} aa.env.setValue("CurrentUserID",myUserId); var preExecute = "PreExecuteForAfterEvents";var documentOnly = false;var SCRIPT_VERSION = 3.0;var useSA = false;var SA = null;var SAScript = null;var bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS","SUPER_AGENCY_FOR_EMSE"); if (bzr.getSuccess() && bzr.getOutput().getAuditStatus() != "I") { 	useSA = true; 		SA = bzr.getOutput().getDescription();	bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS","SUPER_AGENCY_INCLUDE_SCRIPT"); 	if (bzr.getSuccess()) { SAScript = bzr.getOutput().getDescription(); }	}if (SA) {	eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS",SA));	eval(getScriptText("INCLUDES_ACCELA_GLOBALS",SA));	/* force for script test*/ showDebug = true; eval(getScriptText(SAScript,SA));	}else {	eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));	eval(getScriptText("INCLUDES_ACCELA_GLOBALS"));	}	eval(getScriptText("INCLUDES_CUSTOM"));if (documentOnly) {	doStandardChoiceActions(controlString,false,0);	aa.env.setValue("ScriptReturnCode", "0");	aa.env.setValue("ScriptReturnMessage", "Documentation Successful.  No actions executed.");	aa.abortScript();	}var prefix = lookup("EMSE_VARIABLE_BRANCH_PREFIX",vEventName);var controlFlagStdChoice = "EMSE_EXECUTE_OPTIONS";var doStdChoices = true;  var doScripts = false;var bzr = aa.bizDomain.getBizDomain(controlFlagStdChoice ).getOutput().size() > 0;if (bzr) {	var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice ,"STD_CHOICE");	doStdChoices = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I";	var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice ,"SCRIPT");	doScripts = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I";	}	function getScriptText(vScriptName){	var servProvCode = aa.getServiceProviderCode();	if (arguments.length > 1) servProvCode = arguments[1]; vScriptName = vScriptName.toUpperCase();		var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();	try {		var emseScript = emseBiz.getScriptByPK(servProvCode,vScriptName,"ADMIN");		return emseScript.getScriptText() + "";			} catch(err) {		return "";	}} logGlobals(AInfo); if (runEvent && doStdChoices) doStandardChoiceActions(controlString,true,0); if (runEvent && doScripts) doScriptActions(); var z = debug.replace(/<BR>/g,"\r");  aa.print(z);
//
// User code goes here

try {
		if(wfTask == "Permit Issuance" && wfStatus == "Issued"){
			// function scheduleInspection(iType,DaysAhead) // optional inspector ID.  This function requires dateAdd function
			scheduleInspection("Progress Check",2);
		}
	}
catch(err) {
	logDebug("an error occurred : " + err.message + " : " + err.stack);
	}

// end user code
aa.env.setValue("ScriptReturnCode", "0"); 	aa.env.setValue("ScriptReturnMessage", debug)

