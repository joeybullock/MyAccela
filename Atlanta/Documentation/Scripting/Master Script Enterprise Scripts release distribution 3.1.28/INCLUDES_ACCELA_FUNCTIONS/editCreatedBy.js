function editCreatedBy(nCreatedBy) {
	// 4/30/08 - DQ - Corrected Error where option parameter was ignored
	var itemCap = capId;
	if (arguments.length == 2) itemCap = arguments[1]; // use cap ID specified in args

	var capResult = aa.cap.getCap(itemCap)

	if (!capResult.getSuccess())
		{logDebug("**WARNING: error getting cap : " + capResult.getErrorMessage()) ; return false }

	var capE = capResult.getOutput();
	var capEModel = capE.getCapModel()

	capEModel.setCreatedBy(nCreatedBy)

	setCreatedByResult = aa.cap.editCapByPK(capEModel);

	if (!setCreatedByResult.getSuccess())
		{ logDebug("**WARNING: error setting cap created by : " + setCreatedByResult.getErrorMessage()) ; return false }

	return true;
}