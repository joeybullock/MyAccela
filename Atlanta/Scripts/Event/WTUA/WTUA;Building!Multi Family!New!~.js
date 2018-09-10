true ^ showDebug = false; showMessage = false;
wfTask == "Building Plan Review" && wfStatus == "Calc Permit Fee" ^ branch ("CMN:Building/*/*/*:Calc Building Permit Fee");
wfTask == "Plan Coordination" && wfStatus == "Calc Permit Fee" ^ branch ("CMN:Building/*/*/*:Calc Building Permit Fee");
wfTask == "Issue Permit" && wfStatus == "Invoiced" ^ branch ("CMN:Building/*/*/*:Invoice Fees");
wfTask == "Final Plan Coordination" && wfStatus == "Calc Permit Fee" ^ branch ("CMN:Building/*/*/*:Calc Building Permit Fee");
wfTask == "Issue Permit" && wfStatus == "Calc Permit Fee" ^ branch ("CMN:Building/*/*/*:Calc Building Permit Fee");
wfTask == "Inclusionary Zoning Review" && {BPA Subarea} != null && {Total Number of Units} > 9 ^ branch("CMN:Building/Multi Family/New/*:Child IZ Update");