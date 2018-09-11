true ^ relcap= aa.cap.getCap(capRelated[x].getCapID()).getOutput(); relcapId = relcap.getCapID(); relcapName = ""; relcapStat = "";
^ relDateObj = relcap.getFileDate(); relcapDate = relDateObj.getMonth() + "/" + relDateObj.getDayOfMonth() + "/" + relDateObj.getYear();
^ relcapDate >= dateAdd(null,-30) ^ relcapName = relcapId.getCustomID(); relcapStat = relcap.getCapStatus(); relatedCaseCount++;
^ dupArray +=relcapName + " " + relcapDate + " " + relcapStat +  "\r\n";