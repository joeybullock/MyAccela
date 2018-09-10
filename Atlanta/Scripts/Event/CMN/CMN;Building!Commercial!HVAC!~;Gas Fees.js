true ^ showDebug = false; showMessage = false;
true ^ feeRow = GASPIPING[eachrow];
feeRow["GAS PIPING"] == "Up to 1000 CPH Per Motor" ^ addFee("C01","BLDHVAC","FINAL",parseInt(feeRow["Quantity"]),"Y");
feeRow["GAS PIPING"] == "Over 1000 CPH Per Motor" ^ addFee("C02","BLDHVAC","FINAL",parseInt(feeRow["Quantity"]),"Y");
feeRow["GAS PIPING"] == "Cooking Appliances" ^ addFee("C03","BLDHVAC","FINAL",parseInt(feeRow["Quantity"]),"Y");