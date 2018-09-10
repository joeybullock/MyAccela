
function getParentLicenseCapID(itemCap)
{
	if (itemCap == null || aa.util.instanceOfString(itemCap))
	{
		return null;
	}
	
	var licenseCap = null;
	
	var result2 = aa.cap.getProjectByChildCapID(itemCap, "Renewal", null);
	if(result2.getSuccess())
		{
			licenseProjects = result2.getOutput();
			if (licenseProjects != null && licenseProjects.length > 0)
			{
			licenseProject = licenseProjects[0];
			return licenseProject.getProjectID();
			}
		}

	var result = aa.cap.getProjectByChildCapID(itemCap, "EST", null);
    	if(result.getSuccess())
	{
		projectScriptModels = result.getOutput();
		if (projectScriptModels != null && projectScriptModels.length > 0)
		{
		projectScriptModel = projectScriptModels[0];
		licenseCap = projectScriptModel.getProjectID();
		return licenseCap;
		}
	}
	

	logDebug("**WARNING: Could not find parent license Cap for child CAP(" + itemCap + "): ");
		  return false;
		  
	
}

