
function createPendingInspFromReqd() // optional Cap ID
	{
	var itemCap = capId;
	if (arguments.length == 1) itemCap = arguments[0]; // use cap ID specified in args


	var inspListResult = aa.inspection.getInspectionListForSchedule(itemCap.getID1(),itemCap.getID2(),itemCap.getID3());
	
	if (!inspListResult.getSuccess())
		{
		logDebug("**WARNING error retrieving inspections: " + inspListResult.getErrorMessage());
		return false;
		}
		
	var inspList = inspListResult.getOutput();
	
	for (var i in inspList)
		{
		var thisInsp = inspList[i];
		if (thisInsp.getRequiredInspection().equals("Y"))
			{
			createPendingInspection(thisInsp.getGroupCode(),thisInsp.getType(),itemCap);
			}
		}
	}
