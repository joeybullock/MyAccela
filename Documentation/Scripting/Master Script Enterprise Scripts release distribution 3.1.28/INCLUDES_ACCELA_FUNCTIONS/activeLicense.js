function activeLicense(capid)
{
	if (capid == null || aa.util.instanceOfString(capid))
		{
		return false;
	}
	//1. Set status to "Active", and update expired date.
	var result = aa.expiration.activeLicensesByCapID(capid);
	if (result.getSuccess())
		{
		return true;
	} else
		{
		aa.print("ERROR: Failed to activate License with CAP(" + capid + "): " + result.getErrorMessage());
	}
	return false;
}
