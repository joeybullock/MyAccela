true ^ showDebug = false; showMessage = true;
typeof(ELECTRICALSERVICES) =="object" ^  for(eachrow in ELECTRICALSERVICES) branch("CMN:Building/Residential/Electrical/*:Electrical Fees");
{Type of Permit} == "Temporary Pole" && {Number of Temporary Poles} != null ^ updateFee("A01","BLDELECTRICAL","FINAL",{Number of Temporary Poles},"Y");
{Low Voltage} == "CHECKED" && {Total Square Footage} != null ^ updateFee("A03","BLDELECTRICAL","FINAL",{Total Square Footage},"Y");
{Type of Permit} == "Disconnect/Reconnect" && {Disconnect/Reconnect Quantity} != null ^ updateFee("A02","BLDELECTRICAL","FINAL",{Disconnect/Reconnect Quantity},"Y");
{Type of Permit} == "Temporary Power" ^ updateFee("T01","BLDELECTRICAL","FINAL",1,"Y");