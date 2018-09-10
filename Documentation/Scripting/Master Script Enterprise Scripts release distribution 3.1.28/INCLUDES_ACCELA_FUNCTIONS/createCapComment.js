function createCapComment(vComment) //optional CapId, optional vDispOnInsp
{
	var vCapId = capId;
	var vDispOnInsp = "N";
	if (arguments.length >= 2 && typeof(arguments[1]) != "undefined" && arguments[1] != null && arguments[1] != "") {
		vCapId = arguments[1];
	}
	if (arguments.length >= 3 && typeof(arguments[2]) != "undefined" && arguments[2] != null && arguments[2] != "") {
		vDispOnInsp = arguments[2];
	}
	var comDate = aa.date.getCurrentDate();
	var capCommentScriptModel = aa.cap.createCapCommentScriptModel();
	capCommentScriptModel.setCapIDModel(vCapId);
	capCommentScriptModel.setCommentType("APP LEVEL COMMENT");
	capCommentScriptModel.setSynopsis("");
	capCommentScriptModel.setText(vComment);
	capCommentScriptModel.setAuditUser(currentUserID);
	capCommentScriptModel.setAuditStatus("A");
	capCommentScriptModel.setAuditDate(comDate);
	var capCommentModel = capCommentScriptModel.getCapCommentModel();
	capCommentModel.setDisplayOnInsp(vDispOnInsp);
	aa.cap.createCapComment(capCommentModel);
	logDebug("Comment Added");
}