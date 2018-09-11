true ^ showDebug = true; showMessage = true;
true ^ feeA = loadFees()
true ^ for(x in feeA) branch("CMN:Building/Sign/*/*:Invoice New Fees Loop")