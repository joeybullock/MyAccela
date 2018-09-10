typeof(HEATINGSYSTEM) =="object" ^  for(eachrow in HEATINGSYSTEM) branch("CMN:Building/Residential/HVAC/*:Heating Fees");
typeof(COOLINGSYSTEM) =="object" ^  for(eachrow in COOLINGSYSTEM) branch("CMN:Building/Residential/HVAC/*:Cooling Fees");
typeof(GASPIPING) =="object" ^  for(eachrow in GASPIPING) branch("CMN:Building/Residential/HVAC/*:Gas Fees");
typeof(VENTILATION) =="object" ^  for(eachrow in VENTILATION) branch("CMN:Building/Residential/HVAC/*:Ventilation Fees");
typeof(MULTIFAMILY) =="object" ^  for(eachrow in MULTIFAMILY) branch("CMN:Building/Residential/HVAC/*:MultiFamily Fees");
true ^ branch ("CMN:Building/*/*/*:Calc Technology Fee");
true ^ ttlDue = 0; allFees = new Array(); allFees = loadFees(); for (x in allFees) if(allFees[x].amount && allFees[x].code !="BTECH" && allFees[x].code !="ACA CC" && allFees[x].code !="PPFEE" && allFees[x].amountPaid ==0) ttlDue +=allFees[x].amount;if(ttlDue < 150)ttlDue=150 - ttlDue;else ttlDue = 0;addFee("BBASE", "BLDHVAC", "FINAL", ttlDue,"Y");comment("ttlDue = " + ttlDue);