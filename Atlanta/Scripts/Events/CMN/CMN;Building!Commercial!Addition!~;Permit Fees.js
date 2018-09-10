true ^ showDebug = false; showMessage = true;
{Plan Review Fee} == "Yes" ^ updateFee("BTECH","BUILDING","FINAL",1 ,"Y");
{Plan Review Fee} != "Yes" ^ updateFee("BTECH","BUILDING","FINAL",1 ,"N");
{Plan Review Fee} == "Yes" && estValue != null ^ updateFee("BPLAN02", "BUILDING", "FINAL", estValue, "Y");