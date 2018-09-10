{Arborist Zone} == "undefined" ^ var Arborist = null ^ Arborist = {Arborist Zone};
wfTask == "Orange Posting" && wfStatus == "Assigned" ^ scheduleInspectDate("501 Orange Posting", dateAdd(wfDateMMDDYYYY,2,'Y'),Arborist,null,"Scheduled via script");
wfTask.equals("Application Intake") && wfStatus.equals("Accepted") ^ scheduleInspectDate("510 Dead Dying Hazardous Trees", dateAdd(wfDateMMDDYYYY,5,'Y'),Arborist,null,"Scheduled via script");
wfTask.equals("Request Intake") && wfStatus.equals("Accepted") ^ scheduleInspectDate("503 Complaint Inspection", dateAdd(wfDateMMDDYYYY,1,'Y'),Arborist,null,"Scheduled via script");
wfTask.equals("Yellow Posting Request") && wfStatus.equals("Received") ^ scheduleInspectDate("500 Yellow Posting", dateAdd(wfDateMMDDYYYY,2,'Y'),Arborist,null,"Scheduled via script");
wfTask.equals("Case Intake") && wfStatus.equals("Assigned") ^ scheduleInspectDate("504 Illegal Activity", dateAdd(wfDateMMDDYYYY,1,'Y'),Arborist,null,"Scheduled via script");
wfTask.equals("White Posting") && wfStatus.equals("Assigned") ^ branch("CMN:Building/Arborist/*/*:Schedule White Posting Insp");
wfTask.equals("Appeal Action") && wfStatus.equals("No Appeal Filed") ^ activateTask("Close"); editTaskDueDate("Close",dateAdd(null,1)); deactivateTask("Appeal Disposition"); branch ("CMN:Building/Arborist/*/*:Parent CAP Update");
wfTask == "Plans Received" && wfStatus == "Revisions Accepted-No Orange" ^ deactivateTask("Orange Posting");
wfTask == "Orange Posting" && wfStatus == "Posted" ^ deactivateTask("Yellow Posting Request");
wfTask == "Plans Received" && wfStatus == "Accepted" ^ activateTask("Parks Approval");editTaskDueDate("Parks Approval",dateAdd(null,1));
wfTask == "Orange Posting" && wfStatus == "Not Required" ^ closeTask("Yellow Posting Request","Not Required","Yellow Posting not required because Orange Posting not required.",null); deactivateTask("Field Arborist Yellow Posting"); deactivateTask("Appeal Action"); deactivateTask("Appeal Disposition");
matches(wfTask,"Close","Arborist Review") ^ branch ("CMN:Building/Arborist/*/*:Parent CAP Update");
wfTask.equals("Appeal Action") && wfStatus.equals("Appeal Filed") ^ childId = createChild("Building","Arborist","Appeal","NA",capName);copyAppSpecific(childId);updateAppStatus("Pending - Arborist Appeal","Updated via script",childId);holdId=capId;capId=childId;copyParcelGisObjects();capId = holdId;
wfTask.equals("Arborist Preliminary Review") && wfStatus.equals("Accepted Plan Review") ^ childId = createChild("Building","Arborist","Plan Review","NA",capName);  copyAppSpecific(childId);updateAppStatus("Pending - Building","Updated via script",childId);holdId=capId;capId=childId;copyParcelGisObjects();capId = holdId;