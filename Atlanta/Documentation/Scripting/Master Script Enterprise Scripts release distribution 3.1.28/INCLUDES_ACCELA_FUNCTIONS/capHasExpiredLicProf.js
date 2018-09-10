function capHasExpiredLicProf(pDateType, pLicType, pCapId)
	{
	//Checks if any licensed professional of specified type (optional) on CAP has expired,  Expiration date type specified by pDateType.
	//If any have expired, displays message and returns true.  If expiration date is on or before current date, it is expired.
	//If any date is blank, script assumes that date has not expired.
	//Uses functions: refLicProfGetDate, jsDateToMMDDYYYY(), matches()
	//SR5054B
	
	//Validate parameters
	var vDateType;
	if ( pDateType==null || pDateType=="" )
		{
		logDebug ("Invalid expiration type parameter");
		return false;
		}
	else
		{
		vDateType = pDateType.toUpperCase();
		if ( !matches(vDateType, "EXPIRE","INSURANCE","BUSINESS") )
			{
			logDebug ("Invalid expiration type parameter");
			return false;
			}
		}
	var vCapId = pCapId;
	if ( pCapId==null || pCapId=="" ) //If no capid parameter, use current cap
		vCapId = capId;
	
	//get Licensed Profs on CAP
	var licProfResult = aa.licenseScript.getLicenseProf(capId);
	if (!licProfResult.getSuccess())
		{
		logDebug("Error getting CAP's license professional: " +licProfResult.getErrorMessage());
		return false;
		}
	var vToday = new Date();
	var vExpired = false;
	var licProfList = licProfResult.getOutput();
	if (licProfList)
		{
		for (i in licProfList)
			{
			if ( pLicType==null || pLicType=="" || pLicType.equals(licProfList[i].getLicenseType()) )
				{
				var licNum = licProfList[i].getLicenseNbr();
				
				//Check if has expired
				var vResult = refLicProfGetDate(licNum, vDateType);

				if (vResult < vToday)
					{
					vExpired = true;
					logMessage("WARNING: Licence # "+licNum+" expired on "+jsDateToMMDDYYYY(vResult));
					logDebug("Licence # "+licNum+" expired on "+jsDateToMMDDYYYY(vResult));
					}			
				}
			}
		}
	else
		{
		logDebug("No licensed professionals found on CAP");
		return false;
		}
	return vExpired;
	}