 function createRefLP4Lookup(newLicIdString,newLicenseType,conType,conAddrType) {
	//All parameters are required
	//newLicIdString - license altID
	//newLicenseType - Ref LP license type
	//conType - Contact type to use for the reference LP
	//conAddrType - Contact address type to use for the reference LP

	createRefLicProf(newLicIdString,newLicenseType,conType,conAddrType);

	newLic = getRefLicenseProf(newLicIdString);
	if (newLic) {
		//manually set any values on the reference LP
		newLic.setAuditStatus("A");
		aa.licenseScript.editRefLicenseProf(newLic);
		logDebug("Reference LP successfully created");
	} else {
		logDebug("Reference LP not created");
	}

}
