true ^ showDebug = false; showMessage = true;
true ^ feeA = loadFees()
true ^ for(x in feeA) branch("CMN:Building/Commercial/Fire Sprinkler/*:Invoice New Fees Loop")