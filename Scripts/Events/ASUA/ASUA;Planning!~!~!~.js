true ^ showDebug = false; showMessage = false;
capStatus == "Denied" ^ taskCloseAllExcept("Denied");
capStatus == "Withdrawn" ^ taskCloseAllExcept("Withdrawn");
capStatus == "Closed" ^ taskCloseAllExcept("Closed");
capStatus == "Void" ^ taskCloseAllExcept("Void");