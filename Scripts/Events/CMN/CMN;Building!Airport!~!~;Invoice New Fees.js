true ^ showDebug = false; showMessage = true;
true ^ feeA = loadFees();
true ^ for(x in feeA) branch("CMN:Building/Airport/*/*:Invoice New Fees Loop");