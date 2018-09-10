 function createLicense(initStatus,copyASI) {
	//initStatus - record status to set the license to initially
	//copyASI - copy ASI from Application to License? (true/false)

	var newLic = null;
	var newLicId = null;
	var newLicIdString = null;
	var newLicenseType = appTypeArray[2];

	//create the license record
	newLicId = createParent(appTypeArray[0], appTypeArray[1], appTypeArray[2], "License",null);

	//field repurposed to represent the current term effective date
	editScheduledDate(sysDateMMDDYYYY,newLicId);
	//field repurposed to represent the original effective date
	editFirstIssuedDate(sysDateMMDDYYYY,newLicId);

	newLicIdString = newLicId.getCustomID();
	updateAppStatus(initStatus,"",newLicId);

	//copy all ASI
	if(copyASI) {
		copyAppSpecific(newLicId);
	}

	return newLicId;	
}

