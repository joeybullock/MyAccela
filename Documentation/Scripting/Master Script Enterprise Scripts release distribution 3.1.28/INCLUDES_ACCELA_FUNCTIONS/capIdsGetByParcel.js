function capIdsGetByParcel(pParcelNum)
	{
	//Gets CAPs that have parcel pParcelNum, as capId (CapIDModel object)  array (array includes current capId)
	//if parameter pParcelNum is null, uses 1st parcel on current CAP
	//07SSP-00034/SP5015
	//
	if (pParcelNum != null)
		var parcelNum = pParcelNum;
	else
		{
		var capParcelResult = aa.parcel.getParcelandAttribute(capId,null);
		if (!capParcelResult.getSuccess())
			{
			logDebug("**ERROR: Failed to get parcels: " + capParcelResult.getErrorMessage()); 
			return false; 
			}
			
		var Parcels = capParcelResult.getOutput().toArray();
		if (Parcels[0]==undefined)
			{
			logDebug("Current CAP has no parcel");
			return false;
			}
		var parcelNum = Parcels[0].getParcelNumber();
		}
		
	capParcelResult = aa.cap.getCapListByParcelID(parcelNum, aa.util.newQueryFormat());
	
	if (!capParcelResult.getSuccess())
		{
		logDebug("**ERROR: Failed to get parcels: " + capParcelResult.getErrorMessage()); 
		return false; 
		}
	
	var capParArray = capParcelResult.getOutput();
	var capIdParArray = new Array();
	//convert CapIDScriptModel objects to CapIDModel objects
	for (i in capParArray)
		capIdParArray.push(capParArray[i].getCapID());
		
	if (capIdParArray)
		return capIdParArray;
	else
		return false;
	}
		
	