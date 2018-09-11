true ^ showDebug = false; showMessage = true;
wfTask == "Issue Permit" && wfStatus == "Calc Permit Fee" ^ branch ("CMN:Building/Sign/*/*:Calc Permit Fee");
wfTask == "Issue Permit" && wfStatus == "Invoiced" ^ branch ("CMN:Building/Sign/*/*:Invoice New Fees");
wfTask == "Issue Permit" && wfStatus == "Issued" ^ scheduleInspectDate("903 Final", nextWorkDay(dateAdd(null,4)), {BOB Sign Inspectors});
wfTask == "Plan Coordinator" && wfStatus == "Approved" ^ scheduleInspectDate("900 Site", nextWorkDay(dateAdd(null,1)), {BOB Sign Inspectors});
"wfTask == "Zoning Review" && wfStatus == "Denied" ^ deactivateTask("Zoning Review");updateTask("Close","Close - Denied","",""); deactivateTask("Close");"