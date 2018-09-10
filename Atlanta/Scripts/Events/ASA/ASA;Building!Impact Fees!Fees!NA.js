true ^ prntAcct= ""; prntAcct = {Account #};
true ^ editAppSpecific("Parks Service Area",getGISInfo("Atlanta_AA","Park Service Areas","LABEL1"));
true ^ closeTask("Impact Fee Application Intake","Complete","Closed via script",""); if(prntAcct) addParent(prntAcct);