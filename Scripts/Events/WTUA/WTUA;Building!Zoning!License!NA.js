showDebug = false; showMessage = false;
wfTask == "Zoning Review" && wfStatus == "Denied-Illegal Use" ^ deactivateTask("Zoning Review"); updateTask("Closure","Closed","",""); deactivateTask("Closure");
wfTask == "Zoning Review" && wfStatus == "Denied-Permit Required" ^ deactivateTask("Zoning Review"); updateTask("Closure","Closed","",""); deactivateTask("Closure");
wfTask == "Zoning Review" && wfStatus == "Building-Inspection Required" ^ deactivateTask("Zoning Review"); activateTask("Building Inspection"); activateTask("Issue Invoice");
wfTask == "Zoning Review" && wfStatus == "Zoning-Inspection Required" ^ deactivateTask("Zoning Review"); activateTask("Zoning Inspection"); activateTask("Issue Invoice");
wfTask == "Issue Invoice" && wfStatus == "Invoiced" ^ deactivateTask("Issue Invoice"); activateTask("Closure");
wfTask == "Building Inspection" && wfStatus == "Passed" || "Pending C/O" ^ deactivateTask("Building Inspection"); updateTask("Closure","Closed","",""); deactivateTask("Closure");