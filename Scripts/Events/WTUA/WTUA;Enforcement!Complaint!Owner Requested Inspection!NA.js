true ^ showDebug = false; showMessage = false;
wfTask == "Application Intake" && wfStatus == "Inspection Scheduled" ^ inspDays = 1; inspType = "Initial Inspection"; inspector = {BOC Inspector}; branch("BOC:Schedule Code Inspection");