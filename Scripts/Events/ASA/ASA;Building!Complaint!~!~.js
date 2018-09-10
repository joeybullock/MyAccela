true ^ showDebug = true; showMessage = true; comment("Created by ACA Flag = " + cap.isCreatedByACA());
!cap.isCreatedByACA() ^ updateAppStatus("Pending");
{Zoning} == "CHECKED" ^ updateShortNotes("Zoning Case");editAppName("Zoning Case");
{Stop Work} == "CHECKED" ^ updateShortNotes("Stop Work Case");editAppName("Stop Work Case");
{Buildings-Other} == "CHECKED" ^ updateShortNotes("Buildings-Other Case");editAppName("Buildings-Other Case");
true ^ workRelArray = new Array(); showMessage=false;
true ^ relCapArray = getRelatedCapsByAddress("Building/*/*/*")
relCapArray ^ for (x1 in relCapArray) if (!matches(aa.cap.getCap(relCapArray[x1].getCapID()).getOutput().getCapStatus(),"Void","Cancelled","Final","Closed","DONE","Completed")) workRelArray.push(relCapArray[x1].getCustomID()) ^ showMessage = false;
relCapArray ^ for (x1 in relCapArray) if (!matches(aa.cap.getCap(relCapArray[x1].getCapID()).getOutput().getCapStatus(),"Void","Canceled","Final","Closed")) workRelArray.push(relCapArray[x1].getCustomID());
workRelArray.length > 1 ^ showMessage = true ; comment("There are multiple open cases for this address.  The latest match has been added.");updateAppStatus("Potential Duplicate");
workRelArray.length > 0 ^ addParent(workRelArray[(workRelArray.length-1)]);