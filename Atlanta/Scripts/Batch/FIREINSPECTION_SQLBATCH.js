/*------------------------------------------------------------------------------------------------------/
| Program: FireInspection_SQLBatch.js  Trigger: Batch
| Client: Atlanta, GA - Fire
|
|	05/31/2018 RS Base Version
|	06/11/2018 RS Updated to do a 10 day span & specify an Inspection Type.
|	06/25/2018 RS Added parameters for Inspection Types and InspectorID.
|	08/14/2018 RS Added parameters for Guidesheet & adding Guidesheet
|
/------------------------------------------------------------------------------------------------------*/
batchJobName = "FireInspection_SQLBatch";
//aa.env.setValue("paramStdChoice",batchJobName); // Uncomment to use parameters from Batch Param Standard Choice.
logDebug('aa.env.getValue("paramStdChoice"): ' + aa.env.getValue("paramStdChoice"));
if (aa.env.getValue("paramStdChoice") == "") { // If Batch Param Standard Choice is not set then use these parameters.
///* testing parameters, uncomment to use in script test
if (aa.env.getValue("ScriptName") == "Test") {
aa.env.setValue("showDebug", "Y");
aa.env.setValue("CurrentUserID", "ADMIN"); // Current User
aa.env.setValue("ScriptCode", "FireInspection_SQLBatch");  // ScriptName
aa.env.setValue("EventName", "InspectionScheduleAfter");  // EventName
aa.env.setValue("emailAddress", "rschug@truepointsolutions.com");

// Specific Date Range
//aa.env.setValue("fromDate", "05/01/2017");
//aa.env.setValue("toDate", "05/31/2017");

//aa.env.setValue("testCapId", "FIREINSP-201800380");
}

// Set Default values
if (aa.env.getValue("appGroup") == "")		aa.env.setValue("appGroup", "Fire");
if (aa.env.getValue("appTypeType") == "")	aa.env.setValue("appTypeType", "Fire Inspection");
if (aa.env.getValue("appSubtype") == "")	aa.env.setValue("appSubtype", "NA");
if (aa.env.getValue("appCategory") == "")	aa.env.setValue("appCategory", "*");

if (aa.env.getValue("inspGroup") == "")		aa.env.setValue("inspGroup", "FIRE_INSP");
if (aa.env.getValue("inspTypes") == "Test")	aa.env.setValue("inspTypes", "Mecantile,Industrial");
if (aa.env.getValue("guideSheetName") == "")		aa.env.setValue("guideSheetName", "Fire Inspection");

if (aa.env.getValue("inspectorID") == "")	aa.env.setValue("inspectorID", "FIREINSPECTION");
if (aa.env.getValue("inspResultStatus") == "")	aa.env.setValue("inspResultStatus", "Complete with Permit Required");

if (aa.env.getValue("daySpan") == "")		aa.env.setValue("daySpan", 30);
if (aa.env.getValue("sqlMaxRows") == "")	aa.env.setValue("sqlMaxRows", 100);
}
var testCapId = null;
var gisMapService = "ATLANTA_GA";
aa.print("batchJobName: " + batchJobName);
/*------------------------------------------------------------------------------------------------------/
|
| START: USER CONFIGURABLE PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
var GLOBAL_VERSION = 3.0;

var showMessage = false; 	// Set to true to see results in popup window
var showDebug = false; 		// Set to true to see debug messages in popup window
var disableTokens = false; 	// turn off tokenizing of std choices (enables use of "{} and []")
var useAppSpecificGroupName = false; // Use Group name when populating App Specific Info Values
var useTaskSpecificGroupName = false; // Use Group name when populating Task Specific Info Values
var enableVariableBranching = true; // Allows use of variable names in branching.  Branches are not followed in Doc Only
var maxEntries = 99; 		// Maximum number of std choice entries.  Entries must be Left Zero Padded
var maxSeconds = 280;

var cancel = false;

var startDate = new Date();
var startTime = startDate.getTime();
var emailText = "";
var message = ""; 								// Message String
if (typeof debug === 'undefined') {
    var debug = ""; 							// Debug String, do not re-define if calling multiple
}
var br = "<BR>"; 								// Break Tag
var feeSeqList = new Array(); 					// invoicing fee list
var paymentPeriodList = new Array(); 			// invoicing pay periods

var servProvCode = aa.getServiceProviderCode();
var preExecute = "PreExecuteForAfterEvents"; // Standard choice to execute first (for globals, etc)
/*----------------------------------------------------------------------------------------------------/
|
| Start: BATCH PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
var paramStdChoice = getJobParam("paramStdChoice"); // use this standard choice for parameters instead of batch jobs
var paramShowDebug = getJobParam("showDebug");
showDebug = true;
if (String(paramShowDebug).length > 0) {
    showDebug = paramShowDebug.substring(0, 1).toUpperCase().equals("Y");
    if (paramShowDebug == "3") showDebug = 3;
}
showDebug = true;
var currentUserID = getJobParam("CurrentUserID"); // Current User
if (!currentUserID || currentUserID == "") {
    currentUserID = "ADMIN"
}
var vScriptName = "" + getJobParam("BatchJobName"); ;
var vEventName = "" + getJobParam("EventName");
var emailAddress = getJobParam("emailAddress"); // email to send report

var appGroup = getJobParam("appGroup"); 		//   app Group to process {Fire}
var appTypeType = getJobParam("appTypeType"); 		//   app type to process {Fire Inspection}
var appSubtype = getJobParam("appSubtype"); 		//   app subtype to process {NA}
var appCategory = getJobParam("appCategory"); 		//   app category to process {NA}

var inspGroup = getJobParam("inspGroup"); 		//   inspection group
var inspTypes = getJobParam("inspTypes"); 		//   inspection types
if (!inspTypes || inspTypes == "") inspTypes = null;
var guideSheetName = getJobParam("guideSheetName"); 		//   Guidesheet name

var inspResultStatus = getJobParam("inspResultStatus"); //   inspection result status
var inspectorID = getJobParam("inspectorID"); 		//   inspector ID
if (!inspectorID || inspectorID == "") inspectorID = "FIREINSPECTION";

var sqlMaxRows = getJobParam("sqlMaxRows"); // Maximum number of rows to return from processing
if (!sqlMaxRows || sqlMaxRows == "") var sqlMaxRows = 100;

var fromDate = "" + getJobParam("fromDate"); // Date Range.
var toDate = "" + getJobParam("toDate"); //
var daySpan = getJobParam("daySpan"); // Days to search (6 if run weekly, 0 if daily, etc.)
if (!daySpan || daySpan == "") var daySpan = null;

var testCapId = getJobParam("testCapId"); 
if (testCapId && testCapId != "") inspGroup = null;

//Load All Environmental Variables as globals if they are not already loaded
var params = aa.env.getParamValues();
var keys =  params.keys();
var key = null;
while(keys.hasMoreElements()) {
	key = keys.nextElement();
	if (typeof (key) == "undefined") {
		eval("var " + key + " = aa.env.getValue(\"" + key + "\");");
		logDebug("Loaded Env Variable: " + key + " = " + aa.env.getValue(key));
	}
}

var current = new Date();
var dFromDate = null, dToDate = null;
if (!fromDate.length && daySpan) { // no "from" date, assume from today a year ago.
	dFromDate = new Date(current.getFullYear() - 1, current.getMonth(), current.getDate());
	fromDate = (dFromDate.getMonth() < 9 ? "0" + (dFromDate.getMonth()+1) : (dFromDate.getMonth()+1)) + "/" + (dFromDate.getDate() < 10 ? "0" + dFromDate.getDate() : dFromDate.getDate()) + "/" + (dFromDate.getFullYear());
}
if (!fromDate.length) { // no "from" date, assume first day of the current month last year
	dFromDate = new Date(current.getFullYear() - 1, current.getMonth(), 1);
//	dFromDate = new Date(current.getFullYear() - 1, current.getMonth(), current.getDate());
	fromDate = (dFromDate.getMonth() < 9 ? "0" + (dFromDate.getMonth()+1) : (dFromDate.getMonth()+1)) + "/" + (dFromDate.getDate() < 10 ? "0" + dFromDate.getDate() : dFromDate.getDate()) + "/" + (dFromDate.getFullYear());
}
if (!toDate.length && daySpan) { // no "to" date, assume from date + span
	dToDate = new Date(fromDate);
	dToDate.setDate(dToDate.getDate() + parseInt(daySpan,10));
	toDate = (dToDate.getMonth() < 9 ? "0" + (dToDate.getMonth() + 1) : (dToDate.getMonth() + 1)) + "/" + (dToDate.getDate() < 10 ? "0" + dToDate.getDate() : dToDate.getDate()) + "/" + (dToDate.getFullYear());
}
if (!toDate.length) { // no "to" date, assume last day of the month of fromDate
	dToDate = ((dFromDate.getMonth() == 11 ? new Date(dFromDate.getFullYear() + 1, 0, 1) : new Date(dFromDate.getFullYear(), dFromDate.getMonth() + 1, 1))); // First day of next month
	dToDate = new Date(dToDate.getTime() - (1 * 86400000)); // Subtract 1 day
//	dToDate = new Date(dFromDate.getTime() + (10 * 86400000)); // Add 10 day
	toDate = (dToDate.getMonth() < 9 ? "0" + (dToDate.getMonth() + 1) : (dToDate.getMonth() + 1)) + "/" + (dToDate.getDate() < 10 ? "0" + dToDate.getDate() : dToDate.getDate()) + "/" + (dToDate.getFullYear());
}
aa.print("Date Range: " + fromDate + " - " + toDate + " (" + (dFromDate? dFromDate:"") + " - " + (dToDate? dToDate:"") + ")");

/*----------------------------------------------------------------------------------------------------/
|
| End: BATCH PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/

/*----------------------------------------------------------------------------------------------------/
|
| Start: SQL Statement to select inspections
|
/------------------------------------------------------------------------------------------------------*/
var selectString = "";
selectString += "SELECT DISTINCT "
selectString += "       i.B1_PER_ID1, i.B1_PER_ID2, i.B1_PER_ID3, b.B1_ALT_ID capIDString,  b.B1_APPL_STATUS capStatus, i.G6_ACT_NUM inspId ";
selectString += "     , i.G6_COMPL_DD inspResultDate, i.G6_STATUS inspStatus, i.G6_ACT_TYP inspType, i.INSP_GROUP inspGroup, i.G6_ACT_DES inspDesc, i.GA_USERID inspector ";
selectString += "     , si.G6_ACT_NUM inspSchedId ";
selectString += "     , si.INSP_GROUP inspSchedGroup, si.G6_ACT_TYP  inspSchedType, si.G6_STATUS inspSchedStatus ";
selectString += "  FROM G6ACTION i JOIN B1PERMIT b ";
selectString += "    ON b.SERV_PROV_CODE = i.SERV_PROV_CODE ";
selectString += "   AND b.B1_PER_ID1 = i.B1_PER_ID1 ";
selectString += "   AND b.B1_PER_ID2 = i.B1_PER_ID2 ";
selectString += "   AND b.B1_PER_ID3 = i.B1_PER_ID3 ";
selectString += "  LEFT OUTER JOIN G6ACTION si ";
selectString += "    ON si.SERV_PROV_CODE = i.SERV_PROV_CODE ";
selectString += "   AND si.B1_PER_ID1 = i.B1_PER_ID1 ";
selectString += "   AND si.B1_PER_ID2 = i.B1_PER_ID2 ";
selectString += "   AND si.B1_PER_ID3 = i.B1_PER_ID3 ";
selectString += "   AND si.REC_STATUS = 'A' ";
selectString += "   AND si.G6_ACT_NUM != i.G6_ACT_NUM ";
//selectString += "   AND si.G6_ACT_TYP = i.G6_ACT_TYP ";
if (inspGroup && inspGroup != "")
	selectString += "   AND si.INSP_GROUP = '" + inspGroup + "'";			//-- Inspection Group
selectString += "   AND si.G6_STATUS in ('Pending','Scheduled') ";
selectString += " WHERE i.SERV_PROV_CODE = '" + aa.getServiceProviderCode() + "' "; 	//-- Agency
selectString += "   AND i.G6_ACT_GRP = 'Inspection' ";       	           		//-- Inspections
if (testCapId && testCapId != "")
	selectString += "   AND b.B1_ALT_ID = '" + testCapId + "' "; 			//-- Test Cap ID
if (appGroup && appGroup != "" && appGroup != "*")
	selectString += "   AND b.B1_PER_GROUP = '" + appGroup + "' ";			//-- Record Type: Group
if (appTypeType && appTypeType != "" && appTypeType != "*")
	selectString += "   AND b.B1_PER_TYPE = '" + appTypeType + "' ";		//-- Record Type: Type
if (appSubtype && appSubtype != "" && appSubtype != "*")
	selectString += "   AND b.B1_PER_SUB_TYPE =  '" + appSubtype +"' ";		//-- Record Type: SubType
if (appCategory && appCategory != "" && appCategory != "*")
	selectString += "   AND b.B1_PER_CATEGORY = '" + appCategory + "' ";	//-- Record Type: Category
if (inspGroup && inspGroup != "")
	selectString += "   AND i.INSP_GROUP = '" + inspGroup + "'";			//-- Inspection Group
if (inspTypes && inspTypes != "")
	selectString += "   AND i.G6_ACT_TYP IN ('" + inspTypes.split(",").join("','") + "')";			//-- Inspection Types
if (inspResultStatus && inspResultStatus != "")
	selectString += "   AND i.G6_STATUS = '" + inspResultStatus + "' ";		//-- Inspection Status
//selectString += "   AND i.GA_USERID IS NULL "; 		                	//-- Unassigned
selectString += "   AND si.G6_ACT_NUM IS NULL";					//-- Inspection is currently not scheduled/pending.
selectString += "   AND i.G6_COMPL_DD BETWEEN TO_DATE('" + fromDate + "','MM/DD/YYYY') AND TO_DATE('" +  toDate + "','MM/DD/YYYY') "; // Oracle date selection
//selectString += "   AND i.REC_FUL_NAM != 'AA CONV' ";	                	//-- Exclude Conversion Records
if (sqlMaxRows && sqlMaxRows != "")
	selectString += "   AND rownum <= " + sqlMaxRows + " "; 				//-- Limit to first # rows
/*----------------------------------------------------------------------------------------------------/
|
| End: SQL Statement
|
/------------------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------------------/
|
| START: USER CONFIGURABLE PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------------------/
|
| END: USER CONFIGURABLE PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------------------/
| BEGIN Includes
/------------------------------------------------------------------------------------------------------*/
var SCRIPT_VERSION = 3.0;
var useCustomScriptFile = false;  // if true, use Events->Custom Script, else use Events->Scripts->INCLUDES_CUSTOM
var useSA = false;
var SA = null;
var SAScript = null;
var includes_ScriptName = "";
try {
    var bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS", "SUPER_AGENCY_FOR_EMSE");
    if (bzr.getSuccess() && bzr.getOutput().getAuditStatus() != "I") {
        useSA = true;
        SA = bzr.getOutput().getDescription();
        bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS", "SUPER_AGENCY_INCLUDE_SCRIPT");
        if (bzr.getSuccess()) {
            SAScript = bzr.getOutput().getDescription();
        }
    }

    if (SA) {
        eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", SA));
        eval(getScriptText(SAScript, SA));
    } else {
        eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
    }

    eval(getScriptText("INCLUDES_CUSTOM", null, useCustomScriptFile));
    eval(sv_Functions); // Restore Saved Custom Functions.
    eval(getScriptText("INCLUDES_BATCH", null, false));     // Needs to be after INCLUDES_CUSTOM because of logDebug function override.
} catch (err) {
    errMsg = "Failed to include script: " + includes_ScriptName;
    handleErrorScript(err, batchJobName + ": " + errMsg);
}

function getScriptText(vScriptName, servProvCode, useProductScripts) {              // Version 3.1.28
    includes_ScriptName = vScriptName;                                              // Modified
    // aa.print("including script: " + vScriptName);
    if (!servProvCode) servProvCode = aa.getServiceProviderCode();
    vScriptName = vScriptName.toUpperCase();
    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    try {
        if (useProductScripts) {
            var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
        } else {
            var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
        }
        return emseScript.getScriptText() + "";
    } catch (err) {
        return "";
    }
}

function handleErrorScript(err, context) {
    // Modified from handleError to record to server log & include optional parameter for rollback.
    var rollBack = true;
    if (arguments.length > 2 && arguments[2] != null) rollBack = arguments[2];
    var showError = true;

    if (showError) showDebug = true;

    logDebug((rollBack ? "**ERROR** " : "ERROR: ") + err.message + " In " + context + " Line " + err.lineNumber);
    logDebug("  Exception fileName " + err.fileName);
    logDebug("  Exception columnNumber " + err.columnNumber);
    logDebug("  Exception stack " + err.stack);
    logDebug("  Exception Source " + err.toSource());

    aa.debug(aa.getServiceProviderCode() + " : " + aa.env.getValue("CurrentUserID"), context + ": Line: " + err.lineNumber + ", ERROR: " + err.message);
}

// Override Standard functions.
if (true) { 
function logDebug(dstr) {
    aa.print(("" + dstr + br).replace(/<BR>/g,"\r"));
    if (showDebug) {
        emailText += dstr + br;
        aa.debug(aa.getServiceProviderCode() + " : " + aa.env.getValue("CurrentUserID"), dstr);
        if (typeof (batchJobID) == "undefined") batchJobID = "0";
        aa.eventLog.createEventLog("DEBUG", "Batch Process", batchJobName, aa.date.getCurrentDate(), aa.date.getCurrentDate(), "", dstr, batchJobID);
    }
}
}
aa.print("END Includes");
/*------------------------------------------------------------------------------------------------------/
| END Includes
/------------------------------------------------------------------------------------------------------*/
var sysDate = aa.date.getCurrentDate();
batchJobResult = aa.batchJob.getJobID();
batchJobName = "" + aa.env.getValue("BatchJobName");
batchJobID = 0;
if (batchJobResult.getSuccess()) {
    batchJobID = batchJobResult.getOutput();
    logDebug("Batch Job " + batchJobName + " Job ID is " + batchJobID);
} else {
    logDebug("Batch job ID not found " + batchJobResult.getErrorMessage());
}

var acaSite = lookup("ACA_CONFIGS", "ACA_SITE");
acaSite = acaSite.substr(0, acaSite.toUpperCase().indexOf("/ADMIN"));

/*------------------------------------------------------------------------------------------------------/
| <===========Main=Loop================>
|
/-----------------------------------------------------------------------------------------------------*/
var startDate = new Date();
var startTime = startDate.getTime(); // Start timer

var currentUserID = getJobParam("CurrentUserID"); // Current User
if (currentUserID == null || currentUserID == "") currentUserID = "ADMIN";
var systemUserObj = null;  							// Current User Object
var currentUserGroup = null; 					// Current User Group
var publicUserID = null;
var publicUser = false;

if (currentUserID.indexOf("PUBLICUSER") == 0) {
    publicUserID = currentUserID;
    currentUserID = "ADMIN";
    publicUser = true;
}
if (currentUserID != null) {
    systemUserObj = aa.person.getUser(currentUserID).getOutput();  	// Current User Object
}

var sysDate = aa.date.getCurrentDate();
var sysDateMMDDYYYY = dateFormatted(sysDate.getMonth(), sysDate.getDayOfMonth(), sysDate.getYear(), "");
var servProvCode = aa.getServiceProviderCode();

logDebug("EMSE Script Framework Versions");
logDebug("EVENT TRIGGERED: " + vEventName);
logDebug("SCRIPT EXECUTED: " + vScriptName);
logDebug("INCLUDE VERSION: " + INCLUDE_VERSION);
logDebug("SCRIPT VERSION : " + SCRIPT_VERSION);
logDebug("GLOBAL VERSION : " + GLOBAL_VERSION);
logDebug("currentUserID = " + currentUserID);
logDebug("systemUserObj = " + systemUserObj.getClass());
logDebug("sysDate = " + sysDate.getClass());

// Initialize Global Cap Variables
var capId = null,
	cap = null,
	capIDString = "",
	appTypeResult = null,
	appTypeString = "",
	appTypeArray = new Array(),
	capName = null,
	capStatus = null,
	fileDateObj = null,
	fileDate = null,
	fileDateYYYYMMDD = null,
	parcelArea = 0,
	estValue = 0,
	calcValue = 0,
	houseCount = 0,
	feesInvoicedTotal = 0,
	balanceDue = 0,
	houseCount = 0,
	feesInvoicedTotal = 0,
	capDetail = "",
	AInfo = new Array(),
	partialCap = false,
	feeFactor = "",
	parentCapId = null;

logDebug("Start of Job: " + batchJobName + " at " + aa.util.formatDate(aa.util.now(), "MM-dd-YYYY hh:mm:ss"));

try {   // Main Process
    var inspAreaCount = {};
    var capCount = 0;
    var capFilterError = 0;
    var capDeactivated = 0;
	var inspSchedCount = 0;


//	logDebug(""+ aa.util.formatDate(aa.util.now(), "MM-dd-YYYY hh:mm:ss") + ", Elapsed Time : " + elapsed() + " Seconds, Extracting SQL Data into Array");
	logDebug("Extracting SQL Data into Array");
	sqlRows = sqlSelect(selectString);

//	logDebug(""+ aa.util.formatDate(aa.util.now(), "MM-dd-YYYY hh:mm:ss") + ", Elapsed Time : " + elapsed() + " Seconds, Processing " + sqlRows.length + " inspections");
	logDebug("Processing " + sqlRows.length + " inspections");

    for (x in sqlRows) {
        if (elapsed() > maxSeconds) { // only continue if time hasn't expired
            logDebug("Time out Error");
            timeExpired = true;
            break;
        }

        sqlRow = sqlRows[x];
        altId = sqlRow.capIDString;
        var msg = '[' + x + '] ' + sqlRows[x].capIDString + "(" + sqlRows[x].B1_PER_ID1 + '-' + sqlRows[x].B1_PER_ID2 + '-' + sqlRows[x].B1_PER_ID3 + ") inspId: " + sqlRows[x].inspId;
        var s_capResult = aa.cap.getCapID(sqlRows[x].B1_PER_ID1, sqlRows[x].B1_PER_ID2, sqlRows[x].B1_PER_ID3);
        if (!s_capResult.getSuccess()) {
            logDebug(msg + " failed to get capId: " + s_capResult.getErrorMessage());
            capFilterError++;
            continue;
        }

        capId = s_capResult.getOutput();
        var capResult = aa.cap.getCap(capId);
        if (!capResult.getSuccess()) {
            logDebug(altId + ": Record is deactivated, skipping");
            capDeactivated++;
            continue;
        } else {
            var cap = capResult.getOutput();
        }

        aa.env.setValue("PermitId1", capId.getID1());
        aa.env.setValue("PermitId2", capId.getID2());
        aa.env.setValue("PermitId3", capId.getID3());
        // Load Cap Information instead of using INCLUDES_ACCELA_GLOBALS.
//      logDebug("Loading Cap:" + capId);
        loadCap_Batch();
        // eval(getScriptText("INCLUDES_ACCELA_GLOBALS"));
        
        resultCapIdStringSave = capIDString;
        // logGlobals(AInfo);

        //
        // Event Specific Details
        //
		inspSchedId = sqlRow.inspSchedId;
        inspId = sqlRow.inspId;
        inspStatus = sqlRow.inspStatus;
        inspType = sqlRow.inspType;
        inspDesc = sqlRow.inspDesc;
        inspInspector = sqlRow.inspector;
        var inspInspectorObj = null;
        if (inspInspector) inspInspectorObj = aa.person.getUser(inspInspector).getOutput();
        if (inspInspectorObj) {
            var InspectorFirstName = inspInspectorObj.getFirstName();
            var InspectorLastName = inspInspectorObj.getLastName();
            var InspectorMiddleName = inspInspectorObj.getMiddleName();
        } else {
            var InspectorFirstName = null;
            var InspectorLastName = null;
            var InspectorMiddleName = null;
        }

        inspObj = aa.inspection.getInspection(capId, inspId).getOutput(); // current inspection object
		inspGroup = inspObj.getInspection().getInspectionGroup();
		inspResultComment = inspObj.getInspection().getResultComment();
		inspComment = inspResultComment; // consistency between events
		inspResult = inspObj.getInspectionStatus();
		inspResultDate = (inspObj.getInspectionStatusDate()? inspObj.getInspectionStatusDate().getMonth() + "/" + inspObj.getInspectionStatusDate().getDayOfMonth() + "/" + inspObj.getInspectionStatusDate().getYear() : null);
		inspSchedDate = (inspObj.getScheduledDate()? inspObj.getScheduledDate().getMonth() + "/" + inspObj.getScheduledDate().getDayOfMonth() + "/" + inspObj.getScheduledDate().getYear() : null);
		inspTotalTime = inspObj.getTimeTotal();

        inspType = inspObj.getInspectionType();
		//logDebug(""+ aa.util.formatDate(aa.util.now(), "MM-dd-YYYY hh:mm:ss") + ", Elapsed Time : " + elapsed() + " Seconds, Processing [" + x + "] <B>#" + inspId + "</B> " + inspGroup + " " + inspType + " - " + inspDesc + " on " + inspResultDate + " with " + inspResult
		logDebug("Processing [" + x + "] <B>#" + inspId + "</B> " + inspGroup + " " + inspType + " - " + inspDesc + " on " + inspResultDate + " with " + inspResult
				+ " <B>" + capIDString + "</B> (" + capId + ") " + (capName? capName : "") + ", appType: " + appTypeString + ", capStatus: " + capStatus);

        // Actions start here:
        vEventName = "";
        if (vEventName && vEventName != "") {
            var prefix = lookup("EMSE_VARIABLE_BRANCH_PREFIX", vEventName);
            if (preExecute.length)
                doStandardChoiceActions(preExecute, true, 0); // run Pre-execution code


            if (doStdChoices)
                doStandardChoiceActions(controlString, true, 0);

            if (doScripts)
                doScriptActions();
        }

        // Custom Actions start here:
		// schedule Inspection
		// inspectorID = "FIREINSPECTION";
		inspSched = inspType;
		// inspSchedId = getScheduledInspId(inspSched); // Get Scheduled Inspection ID;
		if (!inspSchedId) {
			inspSchedId = createPendingInspection_local(inspGroup, inspSched, capId, inspectorID,"(Annual Inspection)");
			logDebug((inspSchedId? "Pending inspection " + inspSchedId : "ERROR: Pending Inspection not created") + " " + inspSched + ", Inspection ID: " + inspectorID);
			addGuideSheet(capId,inspSchedId,guideSheetName); // Add Guidesheet
			//inspSchedId = scheduleInspection_local(inspSched, "1", capId, inspectorID);
			//logDebug((inspSchedId? "Scheduled " + inspSchedId : "ERROR: Inspection not Scheduled") + " " + inspSched + ", Inspection ID: " + inspectorID);
			if (inspSchedId) inspSchedCount++;
		} else {
			logDebug("Skipped existing scheduled " + inspSchedId + " " + inspSched + ", Inspection ID: " + inspectorID);
		}

        capCount++;

        //
        // Check for invoicing of fees
        //
        if (feeSeqList.length) {
            invoiceResult = aa.finance.createInvoice(capId, feeSeqList, paymentPeriodList);
            if (invoiceResult.getSuccess())
                logDebug("Invoicing assessed fee items is successful.");
            else
                logDebug("**ERROR: Invoicing the fee items assessed to app # " + capIDString + " was not successful.  Reason: " + invoiceResult.getErrorMessage());
        }
    }

    logDebug("Total inspections qualified: " + sqlRows.length);
    logDebug("Ignored due to errors: " + capFilterError);
    logDebug("Ignored due to Deactivated CAP: " + capDeactivated);
    logDebug("Total inspections processed: " + capCount);
    logDebug("Inspections scheduled: " + inspSchedCount);
} catch (err) {
    errMsg = "Failure in Main Process.";
    handleErrorScript(err, batchJobName + ": " + errMsg);
}

logDebug("End of Job: " + batchJobName + " at " + aa.util.formatDate(aa.util.now(), "MM-dd-YYYY hh:mm:ss") + ", Elapsed Time : " + elapsed() + " Seconds");

// Send system email (Results).
try {
    if (typeof (envName) == "undefined") envName = "unknown";
    if (typeof (sysFromEmail) == "undefined") sysFromEmail = "noreply@accela.com";
    if (emailAddress.length) {
        sendResult = aa.sendMail(sysFromEmail, emailAddress, "", (envName + " " + batchJobName + " Results").trim(), emailText);
        if (!sendResult.getSuccess()) {
            logDebug("Failed to send system email To:" + emailAddress + ", From:" + sysFromEmail + ": " + sendResult.getErrorMessage())
        }
    }
    var z = debug.replace(/<BR>/g, "\r");
    aa.print(z);
} catch (err) {
    errMsg = "Failed to send system email(s).";
    handleErrorScript(err, batchJobName + ": " + errMsg);
}

/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------------------/
| BEGIN Functions: INCLUDES_BATCH
/------------------------------------------------------------------------------------------------------*/

function addParameter(pamaremeters, key, value) {
    if (key != null) {
        if (value == null) {
            value = "";
        }

        pamaremeters.put(key, value);
    }
}

function getParam(pParamName) { //gets parameter value and logs message showing param value
    var ret = "" + aa.env.getValue(pParamName);
    logDebug("Parameter : " + pParamName + " = " + ret);
    return ret;
}

function getACAUrl() {

    // returns the path to the record on ACA.  Needs to be appended to the site

    itemCap = capId;
    if (arguments.length == 1)
        itemCap = arguments[0]; // use cap ID specified in args
    var acaUrl = "";
    var id1 = capId.getID1();
    var id2 = capId.getID2();
    var id3 = capId.getID3();
    var cap = aa.cap.getCap(capId).getOutput().getCapModel();

    acaUrl += "/urlrouting.ashx?type=1000";
    acaUrl += "&Module=" + cap.getModuleName();
    acaUrl += "&capID1=" + id1 + "&capID2=" + id2 + "&capID3=" + id3;
    acaUrl += "&agencyCode=" + aa.getServiceProviderCode();
    return acaUrl;
}

function isNull(pTestValue, pNewValue) {
    if (pTestValue == null || pTestValue == "")
        return pNewValue;
    else
        return pTestValue;
}

function elapsed() {
    var thisDate = new Date();
    var thisTime = thisDate.getTime();
    return ((thisTime - startTime) / 1000)
}

function logMessage(dstr) {
    aa.print(dstr);
}

function logDebug(dstr) {
    aa.print(("" + dstr + br).replace(/<BR>/g,"\r"));
    if (showDebug) {
        emailText += dstr + br;
        aa.debug(aa.getServiceProviderCode() + " : " + aa.env.getValue("CurrentUserID"), dstr);
        if (typeof (batchJobID) == "undefined") batchJobID = "0";
        // aa.eventLog.createEventLog("DEBUG", "Batch Process", batchJobName, aa.date.getCurrentDate(), aa.date.getCurrentDate(), "", dstr, batchJobID);
    }
}

function loadCap_Batch() {
    if (typeof (getCapId) != "undefined")
        capId = getCapId();

    if (capId == null) {
        if (aa.env.getValue("CapId") != "") {
            sca = String(aa.env.getValue("CapId")).split("-");
            capId = aa.cap.getCapID(sca[0], sca[1], sca[2]).getOutput();
        } else if (aa.env.getValue("CapID") != "") {
            sca = String(aa.env.getValue("CapID")).split("-");
            capId = aa.cap.getCapID(sca[0], sca[1], sca[2]).getOutput();
        }
    }
    if (capId != null) {
        servProvCode = capId.getServiceProviderCode();
        capIDString = capId.getCustomID();
        cap = aa.cap.getCap(capId).getOutput();
        appTypeResult = cap.getCapType();
        appTypeString = appTypeResult.toString();
        appTypeArray = appTypeString.split("/");
        if (appTypeArray[0].substr(0, 1) != "_") {
            var currentUserGroupObj = aa.userright.getUserRight(appTypeArray[0], currentUserID).getOutput()
            if (currentUserGroupObj) currentUserGroup = currentUserGroupObj.getGroupName();
        }
        capName = cap.getSpecialText();
        capStatus = cap.getCapStatus();
        partialCap = !cap.isCompleteCap();
        fileDateObj = cap.getFileDate();
        fileDate = "" + fileDateObj.getMonth() + "/" + fileDateObj.getDayOfMonth() + "/" + fileDateObj.getYear();
        fileDateYYYYMMDD = dateFormatted(fileDateObj.getMonth(), fileDateObj.getDayOfMonth(), fileDateObj.getYear(), "YYYY-MM-DD");
        var valobj = aa.finance.getContractorSuppliedValuation(capId, null).getOutput();
        if (valobj.length) {
            estValue = valobj[0].getEstimatedValue();
            calcValue = valobj[0].getCalculatedValue();
            feeFactor = valobj[0].getbValuatn().getFeeFactorFlag();
        }

        var capDetailObjResult = aa.cap.getCapDetail(capId);
        if (capDetailObjResult.getSuccess()) {
            capDetail = capDetailObjResult.getOutput();
            var houseCount = capDetail.getHouseCount();
            var feesInvoicedTotal = capDetail.getTotalFee();
            var balanceDue = capDetail.getBalance();
        }
/*
        loadAppSpecific(AInfo);
		loadTaskSpecific(AInfo);
		loadParcelAttributes(AInfo);
		loadASITables();

        var parentCapString = "" + aa.env.getValue("ParentCapID");
        if (parentCapString.length > 0) { parentArray = parentCapString.split("-"); parentCapId = aa.cap.getCapID(parentArray[0], parentArray[1], parentArray[2]).getOutput(); }
        if (!parentCapId) { parentCapId = getParent(); }
        if (!parentCapId) { parentCapId = getParentLicenseCapID(capId); }

        logDebug("<B>Processing " + capIDString + "</B> (" + capId + ") " + (capName?capName:"") + ", appType: " + appTypeString + ", capStatus: " + capStatus);
		if (parentCapId) logDebug("parentCapId = " + parentCapId.getCustomID());
*/
    }
}

/*------------------------------------------------------------------------------------------------------/
| END Functions: INCLUDES_BATCH
/------------------------------------------------------------------------------------------------------*/
function getJobParam(pParamName) //gets parameter value and logs message showing param value
{
    var ret;
    if (aa.env.getValue("paramStdChoice") != "") {
        var b = aa.bizDomain.getBizDomainByValue(aa.env.getValue("paramStdChoice"), pParamName);
        if (b.getSuccess()) {
            ret = b.getOutput().getDescription();
        }

        ret = ret ? "" + ret : ""; // convert to String

        logDebug("Parameter (from std choice " + aa.env.getValue("paramStdChoice") + ") : " + pParamName + " = " + ret);
    } else {
        ret = "" + aa.env.getValue(pParamName);
        logDebug("Parameter (from batch job) : " + pParamName + " = " + ret);
    }
    return ret;
}

function assignInspection(iNumber, iName) {
	// optional capId
	// updates the inspection and assigns to a new user
	// requires the inspection id and the user name
	// V2 8/3/2011.  If user name not found, looks for the department instead
	//

	var itemCap = capId
		if (arguments.length > 2)
			itemCap = arguments[2]; // use cap ID specified in args

		iObjResult = aa.inspection.getInspection(itemCap, iNumber);
	if (!iObjResult.getSuccess()) {
		logDebug("**WARNING retrieving inspection " + iNumber + " : " + iObjResult.getErrorMessage());
		return false;
	}

	iObj = iObjResult.getOutput();

	iInspector = aa.person.getUser(iName).getOutput();

	if (!iInspector) // must be a department name?
	{
		var dpt = aa.people.getDepartmentList(null).getOutput();
		for (var thisdpt in dpt) {
			var m = dpt[thisdpt]
				if (iName.equals(m.getDeptName())) {
					iNameResult = aa.person.getUser(null, null, null, null, m.getAgencyCode(), m.getBureauCode(), m.getDivisionCode(), m.getSectionCode(), m.getGroupCode(), m.getOfficeCode());

					if (!iNameResult.getSuccess()) {
						logDebug("**WARNING retrieving department user model " + iName + " : " + iNameResult.getErrorMessage());
						return false;
					}

					iInspector = iNameResult.getOutput();
				}
		}
	}

	if (!iInspector) {
		logDebug("**WARNING could not find inspector or department: " + iName + ", no assignment was made");
		return false;
	}

	logDebug("assigning inspection " + iNumber + " to " + iName);

	iObj.setInspector(iInspector);

	if (iObj.getScheduledDate() == null) {
		iObj.setScheduledDate(sysDate);
	}

	aa.inspection.editInspection(iObj)
}


function createPendingInspection_local(iGroup,iType) { // optional Cap ID
	// Modified from INCLUDES_ACCELA_FUNCTIONS v9.2 to return inspection Id and allow assignment to inspector.
	var inspId = null;
	var itemCap = capId;
	if (arguments.length > 2) itemCap = arguments[2]; // use cap ID specified in args
	var inspectorName = null;
	var inspectorObj = null;
	if (arguments.length > 3 && arguments[3] != null) {
		var inspectorID = arguments[3];
		var inspRes = aa.person.getUser(inspectorID);
		if (inspRes.getSuccess())	inspectorObj = inspRes.getOutput();
	}

	var itmResult = aa.inspection.getInspectionType(iGroup,iType)
	if (!itmResult.getSuccess()) {
		logDebug("**WARNING error retrieving inspection types: " + itmResult.getErrorMessage);
		return false;
	}

	var itmArray = itmResult.getOutput();
	
	if (!itmArray) {
		logDebug("**WARNING could not find any matches for inspection group " + iGroup + " and type " + iType);
		return false;
	}

	var itmSeq = null;
	for (thisItm in itmArray) {
		var it = itmArray[thisItm];
		if (it.getGroupCode().toUpperCase().equals(iGroup.toUpperCase()) && it.getType().toUpperCase().equals(iType.toUpperCase()))
			itmSeq = it.getSequenceNumber();
	}

	if (!itmSeq) {
		logDebug("**WARNING could not find an exact match for inspection group " + iGroup + " and type " + iType);
		return false;
	}
		
	var inspModel = aa.inspection.getInspectionScriptModel().getOutput().getInspection();
//logDebug("inspModel: " + describe_TPS(inspModel, null, null, true));
//logDebug("inspModel.getRequestComment(): " + describe_TPS(inspModel.getRequestComment()));
// logDebug("inspModel.getActivity(): " + describe_TPS(inspModel.getActivity()));
//	if (inspectorObj) inspModel.setInspector(inspectorObj); // Assign inspection if provided
	
	var activityModel = inspModel.getActivity();
	activityModel.setInspSequenceNumber(itmSeq);
	activityModel.setCapIDModel(itemCap);

	pendingResult = aa.inspection.pendingInspection(inspModel)
	if (pendingResult.getSuccess())	{
		logDebug("Successfully created pending inspection group " + iGroup + " and type " + iType);
		var inspId = pendingResult.getOutput();
	} else {
		logDebug("**WARNING could not create pending inspection group " + iGroup + " and type " + iType + " Message: " + pendingResult.getErrorMessage());
		return false;
	}
	if (inspId && inspectorID) assignInspection(inspId, inspectorID);
	return inspId;
}

function scheduleInspection_local(iType,DaysAhead) // optional inspector ID.  This function requires dateAdd function
	{
	// DQ - Added Optional 4th parameter inspTime Valid format is HH12:MIAM or AM (SR5110) 
	// DQ - Added Optional 5th parameter inspComm ex. to call without specifying other options params scheduleInspection("Type",5,null,null,"Schedule Comment");
	// RS - Modified from INCLUDES_CUSTOM_ACCELA to return inspectionID if inspection was scheduled.
	var inspectorObj = null;
	var inspTime = null;
	var inspComm = "Scheduled via Script";
	if (arguments.length >= 3) 
		if (arguments[2] != null)
		{
		var inspRes = aa.person.getUser(arguments[2])
		if (inspRes.getSuccess())
			var inspectorObj = inspRes.getOutput();
		}

	if (arguments.length >= 4)
	    if (arguments[3] != null)
		    inspTime = arguments[3];
	
	if (arguments.length == 5)
	    if (arguments[4] != null)
	        inspComm = arguments[4];

	var schedRes = aa.inspection.scheduleInspection(capId, inspectorObj, aa.date.parseDate(dateAdd(null,DaysAhead)), inspTime, iType, inspComm)
	if (schedRes.getSuccess()) {
		return schedRes.getOutput();
		logDebug("Successfully scheduled inspection : " + iType + " for " + dateAdd(null,DaysAhead));
	} else {
		logDebug( "**ERROR: adding scheduling inspection (" + iType + "): " + schedRes.getErrorMessage());
	}
	return null;
}

function addGuideSheet(itemCapId,inspectionId,guideSheetName) {
	
	var rgsm = null;
	var r = aa.proxyInvoker.newInstance("com.accela.aa.inspection.guidesheet.RGuideSheetBusiness").getOutput();
	if (r) {
		rgsm = r.getRGuideSheet(aa.getServiceProviderCode(), guideSheetName);
	}
	
	var g = aa.proxyInvoker.newInstance("com.accela.aa.inspection.guidesheet.GGuideSheetBusiness").getOutput();
	
	if (rgsm) {
		var gsSequence = g.createGGuideSheet(itemCapId,rgsm,inspectionId,"ADMIN");
		return gsSequence;
		}
}

function sqlSelect(sql) {
/*
	sql = "SELECT * FROM PUSER"; //SQL select statement. 
	sqlServerName = "<serverName>"; //SQL Server Name or SQL Instance Name if null assumes 
	sqlUser = "<userName>"; //SQL user that has access to the Accela database
	sqlPass = "<sqlPassword>"; //Password for the user above.
*/
	var sqlServerName = null, sqlUser = null, sqlPass = null;
    var maxRows = 1000;
	if (arguments.length > 1) sqlServerName = arguments[1];
	if (arguments.length > 2) sqlUser = arguments[2];
	if (arguments.length > 3) sqlPass = arguments[3];
	if (arguments.length > 4 && arguments[4] != null) maxRows = arguments[4];

    var sqlRows = new Array();
    var sqlSelectStmt = sql.replace("select ", "SELECT ").replace("Select ", "SELECT ").replace(" from ", " FROM ").replace(" From ", " FROM ").replace("distinct ", "DISTINCT ").replace("Distinct ", "DISTINCT ").replace(/  /g," ");
    if (sqlSelectStmt.indexOf("SELECT ") < 0 || sqlSelectStmt.indexOf(" FROM ") < 0) logDebug("SQL not properly formatted SELECT or FROM missing")
    // logDebug("sqlSelectStmt: " + sqlSelectStmt);
    try {
        var sqlSelectItems = (sqlSelectStmt.split(" FROM "))[0].replace("SELECT DISTINCT ", "").replace("SELECT ", "").trim();
		logDebug("sqlSelectItems: " + sqlSelectItems);
        // Parse Select Items
        var sqlSelectItemsArray = sqlSelectItems.split(",");
        var sqlSelectItemNames = new Array();
        for (n in sqlSelectItemsArray) {
            itemName = sqlSelectItemsArray[n];
            var itemNameAlias = itemName.replace(" as "," ").replace("  ", " ").trim();
			if (itemNameAlias.indexOf('"') >= 0  && itemNameAlias.indexOf('"',itemNameAlias.indexOf('"')+1) > 0) {
				itemNameAlias = itemNameAlias.replace('"','[').replace('"',']');
			}
			if (itemNameAlias.indexOf('"') >= 0  && itemNameAlias.indexOf('"',itemNameAlias.indexOf('"')+1) > 0) {
				itemNameAlias = itemNameAlias.replace('"','[').replace('"',']');
			}
			if (itemNameAlias.indexOf("]") < 0) {
				itemNameAlias = itemNameAlias.replace(/ /g,"]");
			}
			itemNm = itemNameAlias.replace(/\[/g,"").trim().split("]");
			if (itemNm.length > 1 && itemNm[1] != "") itemNameAlias = itemNm[1];
			if (itemNameAlias.indexOf(".") > 0) { // Item Name has table prefix, remove it.
				itemNm = itemNameAlias.split(".");
				itemNameAlias = itemNm[1];
			}
			itemNameAlias = itemNameAlias.replace(/\[/g,"").replace(/\]/g,"").trim();
			sqlSelectItemNames.push(itemNameAlias);
        }
		
		if (sqlServerName == null) { // Assuming Accela database connection
			var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
			var ds = initialContext.lookup("java:/AA");
			var conn = ds.getConnection();
		} else {
			var conn = java.sql.DriverManager.getConnection("jdbc:sqlserver://" + sqlServerName, sqlUser, sqlPass);
		}
		if (conn == null) 
		{	logdebug("Unable to connect to database" + (sqlServerName? ": " + sqlServerName:"")); return sqlRows; }
		
		logDebug("Executing SQL Select: " + sql);
        // Execute SQL Select
        var dbStmt = conn.prepareStatement(sql);
		if (dbStmt == null) 
		{	logDebug("Unable to prepare SQL statement."); conn.close(); return sqlRows; }

        dbStmt.executeQuery();
        if (dbStmt.getWarnings()) logDebug("sqlSelect Warnings: " + dbStmt.getWarnings())
        var sqlResults = dbStmt.getResultSet();
        // Process Results
        var sqlRowID = 0;
        while (sqlResults.next()) {
            var sqlObj = new Array();
            var rowMsg = "";
            var rowMsgCSV = "";
            for (n in sqlSelectItemNames) {
                itemName = sqlSelectItemNames[n];
				itemNameAlias = itemName.replace(" ","_");
                try {
                    sqlObj[itemNameAlias] = sqlResults.getString(itemName);
                    rowMsg += (rowMsg == "" ? "" : ", ") + itemNameAlias + ": " + sqlObj[itemNameAlias];
                    rowMsgCSV += (rowMsgCSV == "" ? "" : ", ") + sqlObj[itemNameAlias];
                } catch (err) {
                    if (sqlRowID == 0) logDebug("Error getting SQL Result " + itemNameAlias + " Reason: " + err.message);0
                }
            }
            if (rowMsg != "") {
                sqlRows.push(sqlObj);
                if (sqlRowID == 0) logDebug("RowNum," + sqlSelectItemNames.join(","));
                logDebug(sqlRowID + "," + rowMsgCSV);
            }
            sqlRowID++;
			if (sqlRowID > maxRows) break;
        }
        dbStmt.close();
    } catch (err) {
        logDebug("ERROR: During SQL Select. Reason: " + err.message + " at line " + err.lineNumber + " stack: " + err.stack);
        if (typeof dbStmt != "undefined") dbStmt.close();
    }
    if (typeof conn != "undefined") conn.close();
    return sqlRows;
}


function describe_TPS(obj) {
	// Modified from describe to also include typeof & class of object; seperate Properties from Functions; Sort them; additional arguments.
	var newLine = "\n";
	//	var newLine = br;
	var newLine = "<BR>";
	var ret = "";
	var oType = null;
	var oNameRegEx = /(^set.*$)/; // find set functions
	var oNameRegEx = /(^get.*$)/; // find get functions
	var oNameRegEx = null;
	var verbose = false;
	if (arguments.length > 1) oType = arguments[1];
	if (arguments.length > 2) oNameRegEx = arguments[2];
	if (arguments.length > 3) verbose = arguments[3];
	if (obj == null) {
		ret += ": null";
		return ret;
	}
	try {
		//		ret += "typeof(): " + typeof (obj) + (obj && obj.getClass ? ", class: " + obj.getClass() : "") + newLine;
		var oPropArray = new Array();
		var oFuncArray = new Array();
		if (oType == null) oType = "*";
		try {
			i = null;
			for (var i in obj) {
				if (oNameRegEx && !oNameRegEx.test(i)) { continue; }
				if ((oType == "*" || oType == "function") && typeof (obj[i]) == "function") {
					oFuncArray.push(i);
				} else if ((oType == "*" || oType == "property") && typeof (obj[i]) != "function") {
					oPropArray.push(i);
				}
			}
		} catch (err) {
			showDebug = 3;
			var context = "describe_TPS(" + obj + ") - " + i;
			logDebug("ERROR: An error occured in " + context + " Line " + err.lineNumber + " Error:  " + err.message);
		}
		// List Properties
		oPropArray.sort();
		for (var i in oPropArray) {
			n = oPropArray[i];
			oValue = obj[n];
			if (oValue && oValue.getClass) {
				//				logDebug(n + " " + oValue.getClass());
				if (oValue.getClass().toString().equals("class com.accela.aa.emse.dom.ScriptDateTime")) oValue += " " + (new Date(oValue.getEpochMilliseconds()));
				if (oValue.getClass().toString().equals("class com.accela.aa.emse.util.ScriptDateTime")) oValue += " " + (new Date(oValue.getEpochMilliseconds()));
				// if (oValue.getClass().toString().equals("class java.util.Date")) oValue += " " + convertDate(oValue);
			}
			ret += "property:" + n + " = " + oValue + newLine;
		}
		// List Functions
		oFuncArray.sort();
		for (var i in oFuncArray) {
			n = oFuncArray[i];
			oDef = String(obj[n]).replace("\n", " ").replace("\r", " ").replace(String.fromCharCode(10), " ").replace(String.fromCharCode(10), " ")
			x = oDef.indexOf(n + "()", n.length + 15);
			if (x > 15) x = x + n.length + 1;
			oName = (verbose ? oDef : "function:" + n + "()");                              // Include full definition of function if verbose
			oValue = ((n.toString().indexOf("get") == 0 && x > 0) ? obj[n]() : "");  // Get function value if "Get" function and no parameters.
			if (oValue && oValue.getClass) {
				//				logDebug(n + " " + oValue.getClass());
				if (oValue.getClass().toString().equals("class com.accela.aa.emse.dom.ScriptDateTime")) oValue += " " + (new Date(oValue.getEpochMilliseconds()));
				if (oValue.getClass().toString().equals("class com.accela.aa.emse.util.ScriptDateTime")) oValue += " " + (new Date(oValue.getEpochMilliseconds()));
				// if (oValue.getClass().toString().equals("class java.util.Date")) oValue += " " + convertDate(oValue);
			}
			ret += oName + " = " + oValue + newLine;
		}
	} catch (err) {
		showDebug = 3;
		var context = "describe_TPS(" + obj + ")";
		logDebug("ERROR: An error occured in " + context + " Line " + err.lineNumber + " Error:  " + err.message);
		logDebug("Stack: " + err.stack);
	}
	return ret;
}
