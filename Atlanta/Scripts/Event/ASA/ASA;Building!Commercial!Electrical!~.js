typeof(ELECTRICALSERVICES) =="object" ^  for(eachrow in ELECTRICALSERVICES) branch("CMN:Building/Commercial/Electrical/*:Electrical Fees");
{Type of Permit} == "Temporary Pole" && {Number of Temporary Poles} != null ^ updateFee("A01","BLDELECTRICAL","FINAL",{Number of Temporary Poles},"Y");
{Low Voltage} == "CHECKED" && {Total Square Footage} != null ^ updateFee("A03","BLDELECTRICAL","FINAL",{Total Square Footage},"Y");
{Type of Permit} == "Disconnect/Reconnect" && {Disconnect/Reconnect Quantity} != null ^ updateFee("A02","BLDELECTRICAL","FINAL",{Disconnect/Reconnect Quantity},"Y");
{Type of Permit} == "Temporary Power" ^ updateFee("T01","BLDELECTRICAL","FINAL",1,"Y");
{Type of Permit} == "Public Utility" ^ updateFee("U01", "BLDELECTRICAL", "FINAL", 1, "Y");
true ^ branch ("CMN:Building/*/*/*:Calc Technology Fee");
true ^ ttlDue = 0; allFees = new Array(); allFees = loadFees(); for (x in allFees) if(allFees[x].amount && allFees[x].code !="BTECH" && allFees[x].code !="ACA CC" && allFees[x].code !="PPFEE" && allFees[x].amountPaid ==0) ttlDue +=allFees[x].amount;if(ttlDue < 150 && {Type of Permit} != "Public Utility")ttlDue=150 - ttlDue;else ttlDue = 0;addFee("BBASE", "BLDELECTRICAL", "FINAL", ttlDue,"Y");comment("ttlDue = " + ttlDue);
cap.isCreatedByACA() ^ branch("CMN:Building/*/*/*:Calc ACA Convenience Fee");