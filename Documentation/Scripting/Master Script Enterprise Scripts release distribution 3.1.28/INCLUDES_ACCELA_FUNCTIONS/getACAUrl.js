function getACAUrl(){

	// returns the path to the record on ACA.  Needs to be appended to the site

	itemCap = capId;
	if (arguments.length == 1) itemCap = arguments[0]; // use cap ID specified in args
   	var acaUrl = "";
	var id1 = capId.getID1();
	var id2 = capId.getID2();
	var id3 = capId.getID3();
	var cap = aa.cap.getCap(capId).getOutput().getCapModel();

	acaUrl += "/urlrouting.ashx?type=1000";
	acaUrl += "&Module=" + cap.getModuleName();
	acaUrl += "&capID1=" + id1 + "&capID2=" + id2 + "&capID3=" + id3;
	acaUrl += "&agencyCode=" + aa.getServiceProviderCode();
	return acaUrl;
	}
