 function editFirstIssuedDate(issuedDate) { // option CapId
    var itemCap = capId

    if (arguments.length > 1) itemCap = arguments[1]; // use cap ID specified in args

    var cdScriptObjResult = aa.cap.getCapDetail(itemCap);

    if (!cdScriptObjResult.getSuccess()) { 
        logDebug("**ERROR: No cap detail script object : " + cdScriptObjResult.getErrorMessage()) ; return false; }
    
    var cdScriptObj = cdScriptObjResult.getOutput();

    if (!cdScriptObj) { 
        logDebug("**ERROR: No cap detail script object") ; return false; }

    cd = cdScriptObj.getCapDetailModel();

    var javascriptDate = new Date(issuedDate);

    var vIssuedDate = aa.date.transToJavaUtilDate(javascriptDate.getTime());

    cd.setFirstIssuedDate(vIssuedDate);

    cdWrite = aa.cap.editCapDetail(cd);

    if (cdWrite.getSuccess()) { 
        logDebug("updated first issued date to " + vIssuedDate) ; return true; }
    else { 
        logDebug("**ERROR updating first issued date: " + cdWrite.getErrorMessage()) ; return false ; }

}
