true ^ showDebug = false; showMessage = true;
inspType == "190 Building Final" && inspResult == "Passed" ^ closeTask("Inspection","Passed","Updated by Inspection Result","Note");
inspType == "190 Building Final" && inspResult == "Failed" ^ updateTask("Inspection","Failed","Updated by Inspection Result","Note");
inspType == "190 Building Final" && inspResult == "Additional Reviews Required" ^ updateTask("Inspection","Additional Reviews Required","Updated by Inspection Result","Note");activateTask("Plan Coordination");updateAppStatus("Additional Reviews Required","Updated via script");
inspType == "190 Building Final" && inspResult == "Expired" ^ taskCloseAllExcept("", "Closed via Script");updateAppStatus("Expired","Updated via script");