true ^ showDebug = false; showMessage = true;
((wfTask == "Land Update" && wfStatus == "Complete") || (wfTask == "GIS Update" && wfStatus == "Complete")) && (isTaskStatus("Land Update","Complete") || isTaskStatus("GIS Update","Complete")) ^ deactivateTask("Close"); updateAppStatus("Closed - Approved","Updated via script")
wfTask == "Distribution" && wfStatus == "Denied"  ^ branchTask("Close","Close - Denied","updated via script","");updateAppStatus("Closed - Denied","Updated via script")
appMatch("Planning/Subdivision/*/*") && wfStatus == "Denied"  ^ taskSetAllExcept("N","Y","Closed");updateAppStatus("Closed - Denied","Updated via script");
appMatch("Planning/SAP/*/*") && wfTask == "BoP Review" && wfStatus == "Denied"  ^ taskSetAllExcept("N","Y","Closed");updateAppStatus("Closed - Denied","Updated via script");
appMatch("Planning/ZRB/*/*") && wfStatus == "Failed to Override Veto"  ^ taskSetAllExcept("N","Y","Closed");updateAppStatus("Closed - Vetoed","Updated via script");
appMatch("Planning/ZRB/*/*") && wfTask == "City Council" && wfStatus == "Denied"  ^ taskSetAllExcept("N","Y","Closed");updateAppStatus("Closed - Denied","Updated via script");
appMatch("Planning/Subdivision/Replat/NA") && wfTask == "Plat Review" && wfStatus == "Withdrawn"  ^ taskSetAllExcept("N","Y","Closed");updateAppStatus("Closed - Withdrawn","Updated via script");
appMatch("Planning/Subdivision/Consolidation/NA") && wfTask == "Plat Review" && wfStatus == "Withdrawn"  ^ taskSetAllExcept("N","Y","Closed");updateAppStatus("Closed - Withdrawn","Updated via script");
appMatch("Planning/SAP/*/*") && wfTask == "BoP Review" && wfStatus == "Withdrawn"  ^ taskSetAllExcept("N","Y","Closed");updateAppStatus("Closed - Withdrawn","Updated via script");
appMatch("Planning/Urban Design Commission/Certificate/*") && wfTask == "Urban Design Commission" && wfStatus == "Withdrawn"  ^ taskSetAllExcept("N","Y","Closed");updateAppStatus("Closed - Withdrawn","Updated via script");
appMatch("Planning/ZRB/*/*") && wfTask == "Advertising" && wfStatus == "Withdrawn"  ^ taskSetAllExcept("N","Y","Closed");updateAppStatus("Closed - Withdrawn","Updated via script");
appMatch("Planning/Subdivision/*/*") && wfStatus == "Withdrawn"  ^ taskSetAllExcept("N","Y","Closed");updateAppStatus("Closed - Withrawn","Updated via script");
appMatch("Planning/Subdivision/Replat/NA") && wfStatus == "Denied"  ^ taskSetAllExcept("N","Y","Closed");updateAppStatus("Closed - Denied","Updated via script");
appMatch("Planning/Subdivision/Consolidation/NA") && wfStatus == "Denied"  ^ taskSetAllExcept("N","Y","Closed");updateAppStatus("Closed - Denied","Updated via script");