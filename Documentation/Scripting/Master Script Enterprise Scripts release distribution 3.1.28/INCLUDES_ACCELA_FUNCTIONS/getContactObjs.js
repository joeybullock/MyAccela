function getContactObjs(itemCap) // optional typeToLoad, optional return only one instead of Array?
{
    var typesToLoad = false;
    if (arguments.length == 2) typesToLoad = arguments[1];
    var capContactArray = new Array();
    var cArray = new Array();
    //if (itemCap.getClass().toString().equals("com.accela.aa.aamain.cap.CapModel"))   { // page flow script 
    if (!cap.isCompleteCap() && controlString != "ApplicationSubmitAfter") {

        if (cap.getApplicantModel()) {
            capContactArray[0] = cap.getApplicantModel();
        }
            
        if (cap.getContactsGroup().size() > 0) {
            var capContactAddArray = cap.getContactsGroup().toArray();
            for (ccaa in capContactAddArray)
                capContactArray.push(capContactAddArray[ccaa]);     
        }
    }
    else {
        var capContactResult = aa.people.getCapContactByCapID(itemCap);
        if (capContactResult.getSuccess()) {
            var capContactArray = capContactResult.getOutput();
            }
        }

    if (capContactArray) {
        for (var yy in capContactArray) {
            if (!typesToLoad || exists(capContactArray[yy].getPeople().contactType, typesToLoad)) {
                cArray.push(new contactObj(capContactArray[yy]));
            }
        }
    }
    
    logDebug("getContactObj returned " + cArray.length + " contactObj(s)");
    return cArray;
            
}