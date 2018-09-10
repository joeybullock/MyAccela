function loadAppSpecific4ACA(thisArr) {
	//
	// Returns an associative array of App Specific Info
	// Optional second parameter, cap ID to load from
	//
	// uses capModel in this event


	var itemCap = capId;
	if (arguments.length >= 2)
		{
		itemCap = arguments[1]; // use cap ID specified in args

    		var fAppSpecInfoObj = aa.appSpecificInfo.getByCapID(itemCap).getOutput();

		for (loopk in fAppSpecInfoObj)
			{
			if (useAppSpecificGroupName)
				thisArr[fAppSpecInfoObj[loopk].getCheckboxType() + "." + fAppSpecInfoObj[loopk].checkboxDesc] = fAppSpecInfoObj[loopk].checklistComment;
			else
				thisArr[fAppSpecInfoObj[loopk].checkboxDesc] = fAppSpecInfoObj[loopk].checklistComment;
			}
		}
	else
		{
		var capASI = cap.getAppSpecificInfoGroups();
		if (!capASI) {
			logDebug("No ASI for the CapModel");
			}
		else {
			var i= cap.getAppSpecificInfoGroups().iterator();

			while (i.hasNext())
				{
				 var group = i.next();
				 var fields = group.getFields();
				 if (fields != null)
					{
					var iteFields = fields.iterator();
					while (iteFields.hasNext())
						{
						 var field = iteFields.next();

						if (useAppSpecificGroupName)
							thisArr[field.getCheckboxType() + "." + field.getCheckboxDesc()] = field.getChecklistComment();
						else
							thisArr[field.getCheckboxDesc()] = field.getChecklistComment();
					 }
					}
				 }
			}
		}
	}