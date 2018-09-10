// Use this function to email a Notification Template to the applicant on a Building record 
// when it's ready to issue (WTUA) and it has child records that have a balance due.
function sendPermitReadyToIssueNotification()
{
// Provide the ACA URL
var acaURL = "acasupp3.accela.com/agency"
// Provide the Agency Reply Email
var agencyReplyEmail = "permitsupport@agency.gov"
//Provide the contact types to send this notification
var contactTypesArray = new Array("Applicant","Property Owner");
// Provide the Notification Template to use
var notificationTemplate = "AA_MESSAGE_PERMIT_READY_TO_ISSUE";
// Get an array of Contact Objects using Master Scripts 3.0
var contactObjArray = getContactObjs(capId,contactTypesArray);
// Provide the professional types to send this notification
var profTypesArray = new Array("Engineer","Architect");
// Get an array of Professional Objects
var profObjArray = getLicenseProfessional(capId);

//licenseProfObject(licProfScriptModel.getLicenseNbr(), profTypesArray);

for (iCon in contactObjArray) {
	var tContactObj = contactObjArray[iCon];
	logDebug("Contact Name: " + tContactObj.people.getFirstName() + " " + tContactObj.people.getLastName());
	if(!matches(tContactObj.people.getEmail(),null,undefined,"")) {
		logDebug("Contact Email: " + tContactObj.people.getEmail());
		var eParams = aa.util.newHashtable();
		addParameter(eParams, "$$recordTypeAlias$$", cap.getCapType().getAlias());
		getRecordParams4Notification(eParams);
		getACARecordParam4Notification(eParams,acaURL);
		tContactObj.getEmailTemplateParams(eParams);
		getPrimaryAddressLineParam4Notification(eParams);
		// getWorkflowParams4Notification(eParams); 
		getContactParams4Notification(eParams,contactTypesArray);
		sendNotification(agencyReplyEmail,tContactObj.people.getEmail(),"",notificationTemplate,eParams,null);
	}
	
}
for (iProf in profObjArray) {
	var tProfObj = profObjArray[iProf];
	//logDebug("LP Name: " + tProfObj.people.getFirstName() + " " + tProfObj.people.getLastName());
	var vProfObj = new licenseProfObject(tProfObj.getLicenseNbr());
	logDebug("LP Email: " + vProfObj.refLicModel.getEMailAddress());
	if(!matches(vProfObj.refLicModel.getEMailAddress(),null,undefined,"")) {
		logDebug("LP Email: " + vProfObj.refLicModel.getEMailAddress());
		var eParams = aa.util.newHashtable();
		addParameter(eParams, "$$recordTypeAlias$$", cap.getCapType().getAlias());
		getRecordParams4Notification(eParams);
		getACARecordParam4Notification(eParams,acaURL);
		vProfObj.getEmailTemplateParams(eParams);
		getPrimaryAddressLineParam4Notification(eParams);
		// getWorkflowParams4Notification(eParams); 
		// getContactParams4Notification(eParams,contactTypesArray);
		sendNotification(agencyReplyEmail,vProfObj.refLicModel.getEMailAddress(),"",notificationTemplate,eParams,null);
	} 
}
}
