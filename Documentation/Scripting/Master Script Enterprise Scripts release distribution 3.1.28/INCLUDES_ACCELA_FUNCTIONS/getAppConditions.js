 function getAppConditions(params,pType,pStatus,pDesc,pImpact) {

    if (pType==null)
        var condResult = aa.capCondition.getCapConditions(capId);
    else
        var condResult = aa.capCondition.getCapConditions(capId,pType);
        
    if (condResult.getSuccess())
        var capConds = condResult.getOutput();
    else { 
        logMessage("**ERROR: getting cap conditions: " + condResult.getErrorMessage());
        logDebug("**ERROR: getting cap conditions: " + condResult.getErrorMessage());
    }
    
    var cStatus;
    var cDesc;
    var cImpact;
    
    var condForEmail = "";

    for (cc in capConds) {
        var thisCond = capConds[cc];
        var cStatus = thisCond.getConditionStatus();
        var cDesc = thisCond.getConditionDescription();
        var cPubDisplayMessage = thisCond.getDispPublicDisplayMessage();
        var cImpact = thisCond.getImpactCode();
        var cType = thisCond.getConditionType();
        if (cStatus==null)
            cStatus = " ";
        if (cDesc==null)
            cDesc = " ";
        if (cImpact==null)
            cImpact = " ";
        //Look for matching condition
        
        if ( (pStatus==null || pStatus.toUpperCase().equals(cStatus.toUpperCase())) && (pDesc==null || pDesc.toUpperCase().equals(cDesc.toUpperCase())) && (pImpact==null || pImpact.toUpperCase().equals(cImpact.toUpperCase())))
            condForEmail += cDesc + ": " + cPubDisplayMessage;
    }

    addParameter(params, "$$conditions$$", condForEmail);

    return params; 

}
