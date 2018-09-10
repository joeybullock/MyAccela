capStatus == "Withdrawn" ^ taskCloseAllExcept("Withdrawn");
capStatus == "Closed" ^ taskCloseAllExcept("Closed");
capStatus == "Void" ^ taskCloseAllExcept("Void");
capStatus == "Complied" ^ taskCloseAllExcept("Complied");
capStatus == "No Violation Found" ^ taskCloseAllExcept("No Violation Found");
capStatus == "Court Complied" ^ taskCloseAllExcept("Court Complied")
{Zoning} == "CHECKED" ^ updateShortNotes("Zoning Case");editAppName("Zoning Case");
{Stop Work} == "CHECKED" ^ updateShortNotes("Stop Work Case");editAppName("Stop Work Case");
{Buildings-Other} == "CHECKED" ^ updateShortNotes("Buildings-Other Case");editAppName("Buildings-Other Case");