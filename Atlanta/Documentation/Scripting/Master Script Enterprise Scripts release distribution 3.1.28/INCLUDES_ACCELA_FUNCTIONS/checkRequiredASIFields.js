function checkRequiredASIFields() {

	var appSpecInfoResult = aa.appSpecificInfo.getByCapID(capId);

	var asiObjs = appSpecInfoResult.getOutput();

	var fieldsComplete = true;

	for (var i in asiObjs) {
		if (asiObjs[i].getRequiredFlag() == "Y") {
			if (matches(asiObjs[i].checklistComment,null,undefined,"")) {
				fieldsComplete = false;
			}
		}
	}
	return fieldsComplete;
}