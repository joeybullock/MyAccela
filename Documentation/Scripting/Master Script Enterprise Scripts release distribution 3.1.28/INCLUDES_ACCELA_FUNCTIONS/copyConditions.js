function copyConditions(fromCapId) // optional toCapID
{

	var itemCap = capId;
	if (arguments.length == 2)
		itemCap = arguments[1]; // use cap ID specified in args

	var getFromCondResult = aa.capCondition.getCapConditions(fromCapId);
	if (getFromCondResult.getSuccess())
		var condA = getFromCondResult.getOutput();
	else {
		logDebug("**ERROR: getting cap conditions: " + getFromCondResult.getErrorMessage());
		return false
	}

	for (cc in condA) {
		var thisC = condA[cc];

		var addCapCondResult = aa.capCondition.addCapCondition(itemCap, thisC.getConditionType(), thisC.getConditionDescription(), thisC.getConditionComment(), thisC.getEffectDate(), thisC.getExpireDate(), sysDate, thisC.getRefNumber1(), thisC.getRefNumber2(), thisC.getImpactCode(), thisC.getIssuedByUser(), thisC.getStatusByUser(), thisC.getConditionStatus(), currentUserID, String("A"), null, thisC.getDisplayConditionNotice(), thisC.getIncludeInConditionName(), thisC.getIncludeInShortDescription(), thisC.getInheritable(), thisC.getLongDescripton(), thisC.getPublicDisplayMessage(), thisC.getResolutionAction(), null, null, thisC.getReferenceConditionNumber(), thisC.getConditionGroup(), thisC.getDisplayNoticeOnACA(), thisC.getDisplayNoticeOnACAFee(), thisC.getPriority(), thisC.getConditionOfApproval());
		if (addCapCondResult.getSuccess())
			logDebug("Successfully added condition (" + thisC.getImpactCode() + ") " + thisC.getConditionDescription());
		else
			logDebug("**ERROR: adding condition (" + cImpact + "): " + addCapCondResult.getErrorMessage());
	}
}