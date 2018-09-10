true ^ showDebug = false; showMessage = true;
wfTask == "Building Plan Review" && wfStatus == "Calc Permit Fee" ^ branch ("CMN:Building/*/*/*:Calc Permit Fee");
wfTask == "Plan Coordination" && wfStatus == "Approved-No Trees Impacted"  ^ branch ("CMN:Building/*/*/*:No Trees Impacted");
wfTask == "Plan Coordination" && wfStatus == "Calc Permit Fee" ^ branch ("CMN:Building/*/*/*:Calc Building Permit Fee");
wfTask == "Issue Permit" && wfStatus == "Invoiced" ^ branch ("CMN:Building/*/*/*:Invoice Fees");