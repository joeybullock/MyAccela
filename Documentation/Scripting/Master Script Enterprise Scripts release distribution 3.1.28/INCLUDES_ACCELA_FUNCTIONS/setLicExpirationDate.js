 function setLicExpirationDate(itemCap) {
    //itemCap - license capId
    //the following are optional parameters
    //calcDateFrom - MM/DD/YYYY - the from date to use in the date calculation
    //dateOverride - MM/DD/YYYY - override the calculation, this date will be used
    //renewalStatus - if other than active override the status  


    var licNum = itemCap.getCustomID();

    if (arguments.length == 1) {
        calcDateFrom = null;
        dateOverride = null;
        renewalStatus = null;
    }

    if (arguments.length == 2) {
        calcDateFrom = arguments[1];
        dateOverride = null;
        renewalStatus = null;
    }

    if (arguments.length == 3) {
        calcDateFrom = arguments[1];
        dateOverride = arguments[2];
        renewalStatus = null;
    }

    if (arguments.length == 4) {
        calcDateFrom = arguments[1];
        dateOverride = arguments[2];
        renewalStatus = arguments[3];
    }

    var tmpNewDate = "";
    
    b1ExpResult = aa.expiration.getLicensesByCapID(itemCap);
    
    if (b1ExpResult.getSuccess()) {

        this.b1Exp = b1ExpResult.getOutput();
        //Get expiration details
        var expUnit = this.b1Exp.getExpUnit();
        var expInterval = this.b1Exp.getExpInterval();

        if(expUnit == null) {
            logDebug("Could not set the expiration date, no expiration unit defined for expiration code: " + this.b1Exp.getExpCode());
            return false;
        }

        if(expUnit == "Days") {
            tmpNewDate = dateAdd(calcDateFrom, expInterval);
        }

        if(expUnit == "Months") {
            tmpNewDate = dateAddMonths(calcDateFrom, expInterval);
        }

        if(expUnit == "Years") {
            tmpNewDate = dateAddMonths(calcDateFrom, expInterval * 12);
        }
    }

    thisLic = new licenseObject(licNum,itemCap); 

    if(dateOverride == null) {
        thisLic.setExpiration(dateAdd(tmpNewDate,0));
    } else {
        thisLic.setExpiration(dateAdd(dateOverride,0));
    }

    if(renewalStatus != null) {
        thisLic.setStatus(renewalStatus); 
    } else {
        thisLic.setStatus("Active"); 
    }

    logDebug("Successfully set the expiration date and status");

    return true;

}
