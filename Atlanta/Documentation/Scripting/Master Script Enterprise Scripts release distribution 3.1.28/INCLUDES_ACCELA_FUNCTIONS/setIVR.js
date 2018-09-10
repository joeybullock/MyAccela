function setIVR(ivrnum)
	{
	/* Removed by Peter Peng, 4/9/2012
	capModel = cap.getCapModel();
	capIDModel = capModel.getCapID();
	capIDModel.setTrackingID(12345678);
	capModel.setCapID(capIDModel);
	aa.cap.editCapByPK(capModel);
	*/

	// new a CapScriptModel
	var scriptModel = aa.cap.newCapScriptModel().getOutput();

	// get a new CapModel
	var capModel = scriptModel.getCapModel();
	var capIDModel = capModel.getCapID();

	capIDModel.setServiceProviderCode(scriptModel.getServiceProviderCode());
	capIDModel.setID1(aa.env.getValue("PermitId1"));
	capIDModel.setID2(aa.env.getValue("PermitId2"));
	capIDModel.setID3(aa.env.getValue("PermitId3"));

	capModel.setTrackingNbr(ivrnum);
	capModel.setCapID(capIDModel);

	// update tracking number
	aa.cap.editCapByPK(capModel);
	logDebug("IVR Tracking Number updated to " + ivrnum);
	}


