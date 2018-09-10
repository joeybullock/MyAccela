
function createRefLicProfFromLicProf()
	{
	//
	// Get the lic prof from the app
	//
	capLicenseResult = aa.licenseScript.getLicenseProf(capId);
	if (capLicenseResult.getSuccess())
		{ capLicenseArr = capLicenseResult.getOutput();  }
	else
		{ logDebug("**ERROR: getting lic prof: " + capLicenseResult.getErrorMessage()); return false; }

	if (!capLicenseArr.length)
		{ logDebug("WARNING: no license professional available on the application:"); return false; }

	licProfScriptModel = capLicenseArr[0];
	rlpId = licProfScriptModel.getLicenseNbr();
	//
	// Now see if a reference version exists
	//
	var updating = false;

	var newLic = getRefLicenseProf(rlpId)

	if (newLic)
		{
		updating = true;
		logDebug("Updating existing Ref Lic Prof : " + rlpId);
		}
	else
		var newLic = aa.licenseScript.createLicenseScriptModel();

	//
	// Now add / update the ref lic prof
	//
	newLic.setStateLicense(rlpId);
	newLic.setAddress1(licProfScriptModel.getAddress1());
	newLic.setAddress2(licProfScriptModel.getAddress2());
	newLic.setAddress3(licProfScriptModel.getAddress3());
	newLic.setAgencyCode(licProfScriptModel.getAgencyCode());
	newLic.setAuditDate(licProfScriptModel.getAuditDate());
	newLic.setAuditID(licProfScriptModel.getAuditID());
	newLic.setAuditStatus(licProfScriptModel.getAuditStatus());
	newLic.setBusinessLicense(licProfScriptModel.getBusinessLicense());
	newLic.setBusinessName(licProfScriptModel.getBusinessName());
	newLic.setCity(licProfScriptModel.getCity());
	newLic.setCityCode(licProfScriptModel.getCityCode());
	newLic.setContactFirstName(licProfScriptModel.getContactFirstName());
	newLic.setContactLastName(licProfScriptModel.getContactLastName());
	newLic.setContactMiddleName(licProfScriptModel.getContactMiddleName());
	newLic.setContryCode(licProfScriptModel.getCountryCode());
	newLic.setCountry(licProfScriptModel.getCountry());
	newLic.setEinSs(licProfScriptModel.getEinSs());
	newLic.setEMailAddress(licProfScriptModel.getEmail());
	newLic.setFax(licProfScriptModel.getFax());
	newLic.setLicenseType(licProfScriptModel.getLicenseType());
	newLic.setLicOrigIssDate(licProfScriptModel.getLicesnseOrigIssueDate());
	newLic.setPhone1(licProfScriptModel.getPhone1());
	newLic.setPhone2(licProfScriptModel.getPhone2());
	newLic.setSelfIns(licProfScriptModel.getSelfIns());
	newLic.setState(licProfScriptModel.getState());
	newLic.setLicState(licProfScriptModel.getState());
	newLic.setSuffixName(licProfScriptModel.getSuffixName());
	newLic.setWcExempt(licProfScriptModel.getWorkCompExempt());
	newLic.setZip(licProfScriptModel.getZip());

	if (updating)
		myResult = aa.licenseScript.editRefLicenseProf(newLic);
	else
		myResult = aa.licenseScript.createRefLicenseProf(newLic);

	if (myResult.getSuccess())
		{
		logDebug("Successfully added/updated License ID : " + rlpId)
		return rlpId;
		}
	else
		{ logDebug("**ERROR: can't create ref lic prof: " + myResult.getErrorMessage()); }
	}

