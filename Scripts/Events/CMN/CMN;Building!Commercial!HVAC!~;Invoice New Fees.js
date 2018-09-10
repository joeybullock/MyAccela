true ^ showDebug = false; showMessage = true;
true ^ feeA = loadFees()
true ^ for(x in feeA) branch("CMN:Building/Commercial/HVAC/*:Invoice New Fees Loop")