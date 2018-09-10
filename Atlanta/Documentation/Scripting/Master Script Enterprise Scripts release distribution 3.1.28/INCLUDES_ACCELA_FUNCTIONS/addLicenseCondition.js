function addLicenseCondition(cType,cStatus,cDesc,cComment,cImpact)
	{
	// Optional 6th argument is license number, otherwise add to all CAEs on CAP
	refLicArr = new Array();
	if (arguments.length == 6) // License Number provided
		{
		refLicArr.push(getRefLicenseProf(arguments[5]));
		}
	else // adding to cap lic profs
		{
		var capLicenseResult = aa.licenseScript.getLicenseProf(capId);
		if (capLicenseResult.getSuccess())
			{ var refLicArr = capLicenseResult.getOutput();  }
		else
			{ logDebug("**ERROR: getting lic profs from Cap: " + capLicenseResult.getErrorMessage()); return false; }
		}

	for (var refLic in refLicArr)
		{
		if (arguments.length == 6) // use sequence number
			licSeq = refLicArr[refLic].getLicSeqNbr();
		else
			licSeq = refLicArr[refLic].getLicenseProfessionalModel().getLicSeqNbr();

		if (licSeq >= 0)
			{
			var addCAEResult = aa.caeCondition.addCAECondition(licSeq, cType, cDesc, cComment, null, null, cImpact, cStatus, sysDate, null, sysDate, sysDate, systemUserObj, systemUserObj)

			if (addCAEResult.getSuccess())
				{
				logDebug("Successfully added licensed professional (" + licSeq + ") condition (" + cImpact + ") " + cDesc);
				}
			else
				{
				logDebug( "**ERROR: adding licensed professional (" + licSeq + ") condition (" + cImpact + "): " + addCAEResult.getErrorMessage());
				}
			}
		else
			logDebug("No reference link to license : " + refLicArr[refLic].getLicenseNbr());
		}
	}
