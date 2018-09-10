true ^ showDebug = false; showMessage = true;
wfTask == "Issue Permit" && wfStatus == "Invoiced" ^ branch ("CMN:Building/Residential/HVAC/*:Invoice New Fees");