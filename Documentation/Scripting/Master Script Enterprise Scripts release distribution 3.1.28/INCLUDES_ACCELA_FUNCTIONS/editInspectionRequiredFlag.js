
function editInspectionRequiredFlag(inspType,reqFlag)
	{
	var itemCap = capId
	if (arguments.length > 2) itemCap = arguments[2]; // use cap ID specified in args


	var result = aa.inspection.getInspMilestoneByCapID(itemCap);

	if(!result.getSuccess())
		{ logDebug("**ERROR retrieving inspection milestones: "  + result.getErrorMessage()) ; return false ; }

	inspMilestones= result.getOutput();

	if (!inspMilestones)
		{ logDebug("No Inspection Milestones found") ; return false ; }

	for (thisM in inspMilestones)
		{
		var obj= inspMilestones[thisM];
		if (inspType.equals(obj.getInspType()))
			{
			if (reqFlag) obj.setInspRequired("Y");
			else obj.setInspRequired("N");

			result = aa.inspection.updateInspectionMilestone(inspMilestones);
			if(result.getSuccess())
				logDebug("inspection milestone updated sucessfully.");
			else
				logDebug("**ERROR: could not update inpsection milestone " +result.getErrorMessage());
			}
		}
	}
