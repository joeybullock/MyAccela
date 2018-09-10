function getUserFullName() {
    //optional parameter for userid
    var userId = currentUserID;
    if (arguments.length > 0)
        userId = arguments[0];

    var systemUserObjResult = aa.person.getUser(userId.toUpperCase());

    if (systemUserObjResult.getSuccess()) {
        var systemUserObj = systemUserObjResult.getOutput();

        var userEmail = systemUserObj.getEmail();
        var userFullName = "";

        if (!matches(systemUserObj.getFirstName(),null,undefined,"")) userFullName = systemUserObj.getFirstName();
        if (!matches(systemUserObj.getLastName(),null,undefined,"")) userFullName += " " + systemUserObj.getLastName();
        
        if (userFullName != "")
            return userFullName;
        else
            return false; 

    } else {
        logDebug(systemUserObjResult.getErrorMessage());
        return false;
    }
}
