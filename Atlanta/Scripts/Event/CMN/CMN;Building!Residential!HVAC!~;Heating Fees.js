true ^ showDebug = false; showMessage = false;
true ^ feeRow = HEATINGSYSTEM[eachrow];
feeRow["HEATING SYSTEM"] == "Up to 500,000 Per System" ^ addFee("A01","BLDHVAC","FINAL",parseInt(feeRow["Quantity"]),"Y");
feeRow["HEATING SYSTEM"] == "Over 500,000 Per System" ^ addFee("A02","BLDHVAC","FINAL",parseInt(feeRow["Quantity"]),"Y");
feeRow["HEATING SYSTEM"] == "Decorative Fireplace" ^ addFee("A03","BLDHVAC","FINAL",parseInt(feeRow["Quantity"]),"Y");