true ^ showDebug = false; showMessage = false;
wfTask == "Close" && wfStatus == "Closed" ^ sendQCR_ZONING_APPROVAL();
wfStatus.indexOf("App Notified") > -1 ^ sendNotificationSimple("QCR_APPL_NOTIFIED_REVISIONS_REQD","Y");