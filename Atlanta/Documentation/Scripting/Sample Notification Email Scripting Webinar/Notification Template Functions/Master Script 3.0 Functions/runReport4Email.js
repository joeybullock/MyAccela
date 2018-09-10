function runReport4Email(itemCap,reportName,conObj,rParams,eParams,emailTemplate,module,mailFrom) {
	//If email address available for contact type then email the report, otherwise return false;

	var reportSent = false;

	if (conObj) {
		if (!matches(conObj.people.getEmail(),null,undefined,"")) {
			//Send the report via email
			var rFile;
			rFile = generateReport(itemCap,reportName,module,rParams);
	
			if (rFile) {
				var rFiles = new Array();
				rFiles.push(rFile);
				sendNotification(mailFrom,conObj.people.getEmail(),"",emailTemplate,eParams,rFiles,itemCap);
				return true;
			}
		} else {
			reportSent = false;
		}
	} else {
		reportSent = false;
	}

	if (!reportSent) {
		return false;
	}
}
