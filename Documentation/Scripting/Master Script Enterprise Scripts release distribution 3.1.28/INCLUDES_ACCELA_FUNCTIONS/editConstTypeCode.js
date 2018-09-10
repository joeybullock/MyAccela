function editConstTypeCode(constTypeCode) // option CapId
{
	var itemCap = capId;
	if (arguments.length > 1) {
		itemCap = arguments[1]; // use cap ID specified in args
	}
	var cdScriptObjResult = aa.cap.getCapDetail(itemCap);

	if (!cdScriptObjResult.getSuccess()) {
		logDebug("**ERROR: No cap detail script object : " + cdScriptObjResult.getErrorMessage());
		return false;
	}
	var cdScriptObj = cdScriptObjResult.getOutput();
	if (!cdScriptObj) {
		logDebug("**ERROR: No cap detail script object");
		return false;
	}
	cd = cdScriptObj.getCapDetailModel();
	cd.setConstTypeCode(constTypeCode);
	cdWrite = aa.cap.editCapDetail(cd);
	if (cdWrite.getSuccess()) {
		logDebug("Updated Construction Type Code to " + constTypeCode);
		return true;
	} else {
		logDebug("**ERROR writing capdetail : " + cdWrite.getErrorMessage());
		return false;
	}
}
