 function editCapConditionStatus(pType,pDesc,pStatus,pStatusType) {

	// updates a condition with the pType and pDesc

	// to pStatus and pStatusType, returns true if updates, false if not

	// will not update if status is already pStatus && pStatusType

	// all parameters are required except for pType



	if (pType==null)

		var condResult = aa.capCondition.getCapConditions(capId);

	else

		var condResult = aa.capCondition.getCapConditions(capId,pType);

		

	if (condResult.getSuccess())

		var capConds = condResult.getOutput();

	else

		{ 

		logMessage("**ERROR: getting cap conditions: " + condResult.getErrorMessage());

		logDebug("**ERROR: getting cap conditions: " + condResult.getErrorMessage());

		return false;

		}





	for (cc in capConds) {

		var thisCond = capConds[cc];

		var cStatus = thisCond.getConditionStatus();

		var cStatusType = thisCond.getConditionStatusType();

		var cDesc = thisCond.getConditionDescription();

		var cImpact = thisCond.getImpactCode();

		logDebug(cStatus + ": " + cStatusType);







		

		if (cDesc.toUpperCase() == pDesc.toUpperCase()) {

			if (!pStatus.toUpperCase().equals(cStatus.toUpperCase())) {

				thisCond.setConditionStatus(pStatus);

				thisCond.setConditionStatusType(pStatusType);

				thisCond.setImpactCode("");

				aa.capCondition.editCapCondition(thisCond);

				return true; // condition has been found and updated

			} else {

				logDebug("ERROR: condition found but already in the status of pStatus and pStatusType");

				return false; // condition found but already in the status of pStatus and pStatusType

			}

		}

	}

	

	logDebug("ERROR: no matching condition found");

	return false; //no matching condition found



}



function days_between(date1, date2) {



    // The number of milliseconds in one day

    var ONE_DAY = 1000 * 60 * 60 * 24



    // Convert both dates to milliseconds

    var date1_ms = date1.getTime()

    var date2_ms = date2.getTime()



    // Calculate the difference in milliseconds

    var difference_ms = Math.abs(date1_ms - date2_ms)



    // Convert back to days and return

    return Math.round(difference_ms/ONE_DAY)



}



