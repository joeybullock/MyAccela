


function deleteLicensedProfessional(lsm)  {


	// takes a licenseScriptModel and deletes it, along with public user associations
	
	var lic = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.LicenseBusiness").getOutput();
	var clb = aa.proxyInvoker.newInstance("com.accela.pa.people.license.ContractorLicenseBusiness").getOutput();

	if (lsm)
	   {
	   lm = lsm.getLicenseModel();

	   pubusers = aa.publicUser.getPublicUserListByLicenseSeqNBR(licenseNumber).getOutput().toArray();

	   for (p1 in pubusers)
		{
		pu = pubusers[p1].getUserSeqNum();
		clb.deleteContractorLicense(pu, lsm.getLicenseType(),lsm.getAgencyCode(),licenseNumber);
		logDebug("deleted association to public user: " + pubusers[p1].getUserID());
		}

	   lic.removeLicenseByPK(lm);
	   logDebug(licenseNumber + "has been deleted");
	   }
	}
