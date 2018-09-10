true ^ showDebug = false; showMessage = true;
true ^ feeA = loadFees()
true ^ for(x in feeA) branch("CMN:Building/Residential/Fire Sprinkler/*:Invoice New Fees Loop")