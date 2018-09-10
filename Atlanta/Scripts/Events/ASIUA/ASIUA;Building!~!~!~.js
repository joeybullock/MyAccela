true ^ showDebug = false; showMessage = false;
true ^ editAppSpecific("Permit Scope",{Scope Code} + " - " + appTypeString+ " - " + workDescGet(capId));
true ^ branch ("CMN:Building/*/*/*:Calc LD Bonds");
{Refresh} == "CHECKED" ^ branch("gisGetZoning"); editAppSpecific("Refresh", "");