function editEstimatedJobValue(jobValue) // option CapId
{
	var itemCap = capId;
	if (arguments.length > 1) {
		itemCap = arguments[1]; // use cap ID specified in args
	}
	var bValScriptObjResult = aa.cap.getBValuatn4AddtInfo(itemCap);
	var cdScriptObjResult = aa.cap.getCapDetail(itemCap);
	if (!bValScriptObjResult.getSuccess()) {
		logDebug("**ERROR: No cap detail script object : " + bValScriptObjResult.getErrorMessage());
		return false;
	}
	var bValScriptObj = bValScriptObjResult.getOutput();
	if (!bValScriptObj) {
		logDebug("**ERROR: No valuation detail script object");
		return false;
	}
	if (!cdScriptObjResult.getSuccess()) {
		logDebug("**ERROR: No cap detail script object : " + cdScriptObjResult.getErrorMessage());
		return false;
	}
	var cdScriptObj = cdScriptObjResult.getOutput();
	if (!cdScriptObj) {
		logDebug("**ERROR: No cap detail script object");
		return false;
	}
	bValScriptObj.setEstimatedValue(parseFloat(jobValue));
	var vedtResults = aa.cap.editAddtInfo(cdScriptObj, bValScriptObj);
	if (!vedtResults.getSuccess()) {
		logDebug("**Error updating the job value in additional information" + edtResults.getErrorMessage());
	}
	if (vedtResults !== null && vedtResults.getSuccess() === true) {
		logDebug("Updated the estimated job value to " + jobValue);
	}
}
