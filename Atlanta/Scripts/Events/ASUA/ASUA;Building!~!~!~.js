true ^ showMessage = false; showDebug = false;
capStatus == "Void" ^ taskCloseAllExcept("Void");
capStatus == "Referred" ^ taskCloseAllExcept("Referred");
capStatus == "Closed" ^ taskCloseAllExcept("Closed");
capStatus == "Withdrawn" ^ taskCloseAllExcept("Withdrawn");
capStatus == "void" ^ taskCloseAllExcept();
capStatus == "Terminated" ^ taskCloseAllExcept("Terminated");
capStatus == "Expired" ^ taskCloseAllExcept("Expired");
capStatus == "Revoked" ^ taskCloseAllExcept("Revoked");