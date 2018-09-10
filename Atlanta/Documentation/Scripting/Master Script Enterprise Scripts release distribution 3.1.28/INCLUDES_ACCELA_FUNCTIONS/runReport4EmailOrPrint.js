function runReport4EmailOrPrint(itemCap,reportName,conObj,rParams,eParams,emailTemplate,module) {
	//If email address available for contact type then email the report, otherwise pop up the report on the screen

	var popUpReport = false;

	if (conObj) {
		if (!matches(conObj.people.getEmail(),null,undefined,"")) {
			//Send the report via email
			var rFile;
			rFile = generateReport(itemCap,reportName,module,rParams);
	
			if (rFile) {
				var rFiles = new Array();
				rFiles.push(rFile);
				sendNotification(sysFromEmail,conObj.people.getEmail(),"",emailTemplate,eParams,rFiles);
				comment("Email with " + reportName + " was sent to " + conObj.people.getEmail());
				popUpReport = true;
			}
		} else {
			popUpReport = true;
		}
	} else {
		popUpReport = true;
	}

	if (popUpReport) {
		var rOutput = generateReport4Workflow(itemCap,reportName,module,rParams);
		showMessage = true;
		comment(rOutput);
	}
}