true ^ showDebug = true; showMessage = false;
(({Scope Code}.substr(0,3) == "PSE" || {Scope Code}.substr(0,2) == "PV") && ({Scope Code 1}.substr(0,3) == "PSE" || {Scope Code 1}.substr(0,2) == "PV") && ({Zoning 1}.substr(0,2) == "R-")) ^ addFee("C03","BOPFLATFEES","FINAL",1,"N");
matches({Zoning 1}.substr(0,3),"R-1","R-2","R-3","R-4","R-5") ^ branch("BOPZONINGFEE_C02");