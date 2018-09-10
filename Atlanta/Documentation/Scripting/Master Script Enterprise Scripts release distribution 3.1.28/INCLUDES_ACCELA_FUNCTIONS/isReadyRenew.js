function isReadyRenew(capid) {
    if (capid == null || aa.util.instanceOfString(capid)) {
        return false;
    }
    var result = aa.expiration.isExpiredLicenses(capid);
    if (result.getSuccess()) {
        return true;
    }
    else {
        logDebug("ERROR: Failed to get expiration with CAP(" + capid + "): " + result.getErrorMessage());
    }
    return false;
}

