true ^ showDebug = false; showMessage = true;
true ^ feeA = loadFees()
true ^ for(x in feeA) branch("CMN:Building/Residential/Low Voltage/*:Invoice New Fees Loop")