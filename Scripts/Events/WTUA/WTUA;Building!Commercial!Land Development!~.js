wfTask == "Building Plan Review" && wfStatus == "Calc Permit Fee" ^ branch ("CMN:Building/*/*/*:Calc Permit Fee");
wfTask == "Plan Coordination" && wfStatus == "Calc Permit Fee" ^ branch ("CMN:Building/*/*/*:Calc Permit Fee");
wfTask == "Issue Permit" && wfStatus == "Invoiced" ^ branch ("CMN:Building/*/*/*:Invoice Fees");
wfTask == "Final Plan Coordination" && wfStatus == "Calc Permit Fee" ^ branch ("CMN:Building/*/*/*:Calc Permit Fee");
wfTask == "Issue Permit" && wfStatus == "Calc Permit Fee" ^ branch ("CMN:Building/*/*/*:Calc Permit Fee");