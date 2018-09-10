function sendInspectionResultGuidesheetReport(){
// Provide the ACA URl - This should be set in INCLUDES_CUSTOM_GLOBALS
var acaURL = "aca.demo.accela.com/csm"
// Provide the Agency Reply Email - This should be set in INCLUDES_CUSTOM_GLOBALS
var agencyReplyEmail = "noreply@accela.com"
// Provide the contact types to send this notification
var contactTypesArray = new Array("Applicant", "Property Owner", "Business Owner");
// Provide the Notification Template to use
var notificationTemplate = "MESSAGE_INSPECTION_RESULT_GUIDESHEET";
// Provide the name of the report from Report Manager
var reportName = "Inspection Results with Guidesheet";
// Get an array of Contact Objects using Master Scripts 3.0
var contactObjArray = getContactObjs(capId,contactTypesArray);
// Set the report parameters. For Ad Hoc use p1Value, p2Value etc.
var rptParams = aa.util.newHashMap();
//rptParams.put("serviceProviderCode",servProvCode);
rptParams.put("p1Value", capIDString);

// Call runReportAttach to attach the report to Documents Tab
var attachResults = runReportAttach(capId,reportName,"p1Value",capIDString);

for (iCon in contactObjArray) {

	var tContactObj = contactObjArray[iCon];
	logDebug("ContactName: " + tContactObj.people.getFirstName() + " " + tContactObj.people.getLastName());
	if (!matches(tContactObj.people.getEmail(),null,undefined,"")) {
		logDebug("Contact Email: " + tContactObj.people.getEmail());
		var eParams = aa.util.newHashtable();
		addParameter(eParams, "$$recordTypeAlias$$", cap.getCapType().getAlias());
		getRecordParams4Notification(eParams);
		getACARecordParam4Notification(eParams,acaURL);
		tContactObj.getEmailTemplateParams(eParams);
		getInspectionResultParams4Notification(eParams);
		getPrimaryAddressLineParam4Notification(eParams);
		if(!matches(reportName,null,undefined,"")){
			// Call runReport4Email to generate the report and send the email
			runReport4Email(capId,reportName,tContactObj,rptParams,eParams,notificationTemplate,cap.getCapModel().getModuleName(),agencyReplyEmail);	
		}
		else{
			// Call sendNotification if you are not using a report
			sendNotification(agencyReplyEmail,tContactObj.people.getEmail(),"",notificationTemplate ,eParams,null);
		}
	}

}
}