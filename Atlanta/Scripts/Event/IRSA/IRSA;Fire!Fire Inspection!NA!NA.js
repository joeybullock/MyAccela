inspType == "Initial Inspection" && inspResult == "Complete" ^ updateTask("Fire Inspector Review","Complete","Updated by Inspection Result","Note"); deactivateTask("Fire Inspector Review"); updateTask("Fire Inspection Complete","Complete"); deactivateTask("Fire Inspection Complete"); updateAppStatus("Complete","Updated via script");
inspType == "Initial Inspection" && inspResult == "Re-Inspection Required" ^ updateTask("Fire Inspector Review","Re-Inspection Required","Updated by Inspection Result","Note"); scheduleInspection("Re-Inspection","",currentUserID);
inspType == "Initial Inspection" && inspResult == "Follow-Up Required" ^ updateTask("Fire Inspector Review","Follow-Up Required","Updated by Inspection Result","Note");
(inspType == "Initial Inspection" && inspResult == "Complete with Permit Required") && {Permit Classification} == null ^ comment("inside error check"); showMessage = true ; comment("Please select a permit classification"); cancel = true;
inspType == "Initial Inspection" && inspResult == "Complete with Permit Required" ^ updateTask("Fire Inspector Review","Complete with Permit Required","Updated by Inspection Result","Note"); deactivateTask("Fire Inspector Review"); updateTask("Fire Inspection Complete","Complete"); deactivateTask("Fire Inspection Complete"); updateAppStatus("Complete with Permit Required","Updated via script");
^ updateAppStatus("Complete","Updated via script");
// Follow-Up Required section
(matches(inspType, "Initial Inspection") && inspResult == "Follow-Up Required") ^ updateTask("Fire Inspector Review","Follow-Up Required","Updated by Inspection Result script","Script updated");
//scheduleInspection("Follow-Up Inspection","",currentUserID);
^ createPendingInspection("FIRE_INSP","Follow-Up Inspection");
// Re-Inspection Required section
(matches(inspType, "Follow-Up Inspection","Re-Inspection") && inspResult == "Re-Inspection Required") ^ updateTask("Fire Inspector Review","Re-Inspection Required","Updated by Inspection Result","Note");
//scheduleInspection("Re-Inspection","",currentUserID);
^ createPendingInspection("FIRE_INSP","Re-Inspection");
// Complete with Permit Required section