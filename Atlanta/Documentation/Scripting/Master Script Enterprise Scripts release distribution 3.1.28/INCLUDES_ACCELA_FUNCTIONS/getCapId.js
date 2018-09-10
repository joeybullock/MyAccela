function getCapId() {

	var s_id1 = aa.env.getValue("PermitId1");
	var s_id2 = aa.env.getValue("PermitId2");
	var s_id3 = aa.env.getValue("PermitId3");

	if (s_id1 == null || s_id1 == ""
		 || s_id2 == null || s_id2 == ""
		 || s_id3 == null || s_id3 == "") {
		return null;
	}
	var s_capResult = aa.cap.getCapID(s_id1, s_id2, s_id3);
	if (s_capResult.getSuccess())
		return s_capResult.getOutput();
	else {
		logDebug("function getCapID: failed to get capId from script environment: " + s_capResult.getErrorMessage());
		return null;
	}
}
