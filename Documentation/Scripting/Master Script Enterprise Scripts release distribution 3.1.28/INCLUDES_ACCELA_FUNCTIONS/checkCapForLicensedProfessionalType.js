function checkCapForLicensedProfessionalType( licProfType )
{
	var capLicenseResult = aa.licenseScript.getLicenseProf(capId);
	
	if( capLicenseResult.getSuccess() )
	{ 
		var capLicenseArr = capLicenseResult.getOutput();
		
		if (!capLicenseArr)
			{ logDebug("WARNING: no license professional available on the application:"); return false; }
		
		for( licProf in capLicenseArr )
		{
			if( licProfType.equals(capLicenseArr[licProf].getLicenseType()) )
			{
				aa.print( "Found License Professional with Type= " + licProfType );
				return true; //Found Licensed Prof of specified type
			}
		}
		
		return false;
	}
	else
		{ aa.print("**ERROR: getting lic prof: " + capLicenseResult.getErrorMessage()); return false; }
}