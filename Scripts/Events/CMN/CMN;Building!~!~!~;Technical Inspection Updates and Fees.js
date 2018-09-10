true ^ showDebug = false; showMessage = true;
inspType.indexOf("Final") != -1 && inspResult == "Passed" ^ closeTask("Inspection","Passed","Updated by Inspection Result","Note");
inspType == "210 Temporary Pole" && inspResult == "Passed" ^ taskCloseAllExcept("", "Closed via Script");updateAppStatus("Closed - Passed","Updated via script");