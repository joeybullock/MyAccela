true ^ showDebug = false; showMessage = true;
wfTask == "Issue Permit" && wfStatus == "Invoiced" ^ branch ("CMN:Building/Commercial/Plumbing/*:Invoice New Fees");