
function copyLicensedProf(sCapId, tCapId)
{
	//Function will copy all licensed professionals from source CapID to target CapID

	var licProf = aa.licenseProfessional.getLicensedProfessionalsByCapID(sCapId).getOutput();
	if (licProf != null)
		for(x in licProf)
		{
			licProf[x].setCapID(tCapId);
			aa.licenseProfessional.createLicensedProfessional(licProf[x]);
			logDebug("Copied " + licProf[x].getLicenseNbr());
		}
	else
		logDebug("No licensed professional on source");
}
