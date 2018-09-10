
function loadAppSpecificBefore(thisArr) {
	//
	// Returns an associative array of App Specific Info
	//
	for (loopk in AppSpecificInfoModels)
		{
		if (useAppSpecificGroupName)
			{
			thisArr[AppSpecificInfoModels[loopk].getCheckboxType() + "." + AppSpecificInfoModels[loopk].checkboxDesc] = AppSpecificInfoModels[loopk].checklistComment;
			logDebug("{" + AppSpecificInfoModels[loopk].getCheckboxType() + "." + AppSpecificInfoModels[loopk].checkboxDesc + "} = " + AppSpecificInfoModels[loopk].checklistComment);
			}
			else
			{
			thisArr[AppSpecificInfoModels[loopk].checkboxDesc] = AppSpecificInfoModels[loopk].checklistComment;
			logDebug("{" + AppSpecificInfoModels[loopk].checkboxDesc + "} = " + AppSpecificInfoModels[loopk].checklistComment);
			}
		}
	}

