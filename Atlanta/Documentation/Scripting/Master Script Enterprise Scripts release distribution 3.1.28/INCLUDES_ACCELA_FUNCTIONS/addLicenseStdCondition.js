
function addLicenseStdCondition(licSeqNum,cType,cDesc)
	{

	var foundCondition = false;
	
	cStatus = "Applied";
	if (arguments.length > 3)
		cStatus = arguments[3]; // use condition status in args
		
	if (!aa.capCondition.getStandardConditions)
		{
		logDebug("addLicenseStdCondition function is not available in this version of Accela Automation.");
		}
        else
		{
		standardConditions = aa.capCondition.getStandardConditions(cType,cDesc).getOutput();
		for(i = 0; i<standardConditions.length;i++)
			if(standardConditions[i].getConditionType().toUpperCase() == cType.toUpperCase() && standardConditions[i].getConditionDesc().toUpperCase() == cDesc.toUpperCase()) //EMSE Dom function does like search, needed for exact match
			{
			standardCondition = standardConditions[i]; // add the last one found
			
			foundCondition = true;
		
			if (!licSeqNum) // add to all reference licenses on the current capId
				{
				var capLicenseResult = aa.licenseScript.getLicenseProf(capId);
				if (capLicenseResult.getSuccess())
					{ var refLicArr = capLicenseResult.getOutput();  }
				else
					{ logDebug("**ERROR: getting lic profs from Cap: " + capLicenseResult.getErrorMessage()); return false; }

				for (var refLic in refLicArr)
					if (refLicArr[refLic].getLicenseProfessionalModel().getLicSeqNbr())
						{
						licSeq = refLicArr[refLic].getLicenseProfessionalModel().getLicSeqNbr();
						var addCAEResult = aa.caeCondition.addCAECondition(licSeq, standardCondition.getConditionType(), standardCondition.getConditionDesc(), standardCondition.getConditionComment(), null, null, standardCondition.getImpactCode(), cStatus, sysDate, null, sysDate, sysDate, systemUserObj, systemUserObj);

						if (addCAEResult.getSuccess())
							{
							logDebug("Successfully added licensed professional (" + licSeq + ") condition: " + cDesc);
							}
						else
							{
							logDebug( "**ERROR: adding licensed professional (" + licSeq + ") condition: " + addCAEResult.getErrorMessage());
							}
						}
				}
			else
				{
				var addCAEResult = aa.caeCondition.addCAECondition(licSeqNum, standardCondition.getConditionType(), standardCondition.getConditionDesc(), standardCondition.getConditionComment(), null, null, standardCondition.getImpactCode(), cStatus, sysDate, null, sysDate, sysDate, systemUserObj, systemUserObj);
				
				if (addCAEResult.getSuccess())
					{
					logDebug("Successfully added licensed professional (" + licSeqNum + ") condition: " + cDesc);
					}
					else
					{
					logDebug( "**ERROR: adding licensed professional (" + licSeqNum + ") condition: " + addCAEResult.getErrorMessage());
					}
				}	
			}
		}
	if (!foundCondition) logDebug( "**WARNING: couldn't find standard condition for " + cType + " / " + cDesc);
	}

