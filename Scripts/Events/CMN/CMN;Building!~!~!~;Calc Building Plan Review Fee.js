true ^ showDebug = false; showMessage = true;
{Plan Review Deposit} == "Yes" ^ updateFee("BTECH","BUILDING","FINAL",1 ,"Y");
{Plan Review Deposit} != "Yes" ^ updateFee("BTECH","BUILDING","FINAL",1 ,"Y");
{Plan Review Deposit} == "Yes" && estValue != null ^ updateFee("BPLAN02", "BUILDING", "FINAL", estValue, "Y");
cap.isCreatedByACA() ^ branch("CMN:Building/*/*/*:Calc ACA Convenience Fee");