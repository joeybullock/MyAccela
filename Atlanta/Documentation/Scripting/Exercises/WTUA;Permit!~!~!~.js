try {
		if(wfTask == "Permit Issuance" && wfStatus == "Issued"){
			// function scheduleInspection(iType,DaysAhead) // optional inspector ID.  This function requires dateAdd function
			scheduleInspection("Progress Check",2);
		}
	}
catch(err) {
	logDebug("an error occurred : " + err.message + " : " + err.stack);
	}