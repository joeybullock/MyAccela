true ^ showDebug = false; showMessage = true;
true ^ feeRow = COOLINGSYSTEM[eachrow];
feeRow["COOLING SYSTEM"] == "Up to 5 tons" ^ addFee("B01","BLDHVAC","FINAL",parseInt(feeRow["Quantity"]),"Y");
feeRow["COOLING SYSTEM"] == "Over 5 tons" ^ addFee("B02","BLDHVAC","FINAL",parseInt(feeRow["Quantity"]),"Y");