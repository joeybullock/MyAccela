function updateGuidesheetID(inspId,gName,nGuideSheetID) {
	//updates the guidesheet ID to nGuideSheetID if not currently populated
	//optional capId

	var itemCap = capId;
	if (arguments > 2) itemCap = arguments[2];

	var r = aa.inspection.getInspections(itemCap);

	if (r.getSuccess()) {
		var inspArray = r.getOutput();

		for (i in inspArray) {
			if (inspArray[i].getIdNumber() == inspId) {
				var inspModel = inspArray[i].getInspection();

				var gs = inspModel.getGuideSheets();

				if (gs) {
					gsArray = gs.toArray();
					for (var loopk in gsArray) {
						if (gName.toUpperCase() == gsArray[loopk].getGuideType().toUpperCase()) {
							gsArray[loopk].setIdentifier(nGuideSheetID);
							var updateResult = aa.guidesheet.updateGGuidesheet(gsArray[loopk],gsArray[loopk].getAuditID());
							if (updateResult.getSuccess()) {
								logDebug("Successfully updated " + gName + " on inspection " + inspId + " to and ID of " + nGuideSheetID);
								return true;
							} else {
								logDebug("Could not update guidesheet ID: " + updateResult.getErrorMessage());
								return false;
							}
						}
					}
				} else {
					// if there are guidesheets
					logDebug("No guidesheets for this inspection");
					return false;
				}
			}
		}
	} else {
		logDebug("No inspections on the record");
		return false;
	}
	logDebug("No updates to the guidesheet made");
	return false;
}