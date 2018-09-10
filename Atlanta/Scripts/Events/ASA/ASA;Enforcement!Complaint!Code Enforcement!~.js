{Property Maintenance} == "CHECKED" ^ updateShortNotes("Property Maintenance");editAppName("Property Maintenance");
{Highly Hazardous} == "CHECKED" ^ updateShortNotes("Highly Hazardous");editAppName("Highly Hazardous");
{Property Maintenance} == "CHECKED" && {Highly Hazardous} == "CHECKED" ^ updateShortNotes("Highly Hazardous");editAppName("Highly Hazardous");
!cap.isCreatedByACA() ^ updateAppStatus("In Progress");
true ^ if(matches({NPU},"J","K","N", "O", "P", "Q", "S", "W")) assignTask("Supervisor Review","WKIRKLAND"); if(matches({NPU},"E", "F", "L", "M", "T", "V", "X", "Y")) assignTask("Supervisor Review","DLBRYANT"); if(matches({NPU},"A","B","C","D","G","H","I","R","Z")) assignTask("Supervisor Review","LBPARKS");
true ^ workRelArray = new Array(); showMessage=false;
true ^ relCapArray = getRelatedCapsByAddress("Enforcement/*/*/*")
relCapArray ^ for (x1 in relCapArray) if (!matches(aa.cap.getCap(relCapArray[x1].getCapID()).getOutput().getCapStatus(),"Void","Cancelled","Final","Closed","DONE","Completed")) workRelArray.push(relCapArray[x1].getCustomID()) ^ showMessage = false;
workRelArray.length > 1 ^ showMessage = true ; comment("There are multiple open cases for this address.  The latest match has been added.");updateAppStatus("Potential Duplicate","");
workRelArray.length > 0 ^ addParent(workRelArray[(workRelArray.length-1)]);
{Inspector} == "undefined" ^ updateAppStatus("In Progress","GIS Zoning Data Not Found");
{Inspector} != "undefined" ^ scheduleInspectDate("Initial Inspection",dateAdd(null,1,"Y"),{Inspector}); activateTask("Initial Inspection"); closeTask("Supervisor Review","Scheduled");