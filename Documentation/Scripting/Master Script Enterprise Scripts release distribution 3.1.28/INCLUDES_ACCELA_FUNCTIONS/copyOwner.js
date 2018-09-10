
//Function will copy all owners from source CAP (sCapID) to target CAP (tCapId)
function copyOwner(sCapID, tCapID)
{
	var ownrReq = aa.owner.getOwnerByCapId(sCapID);
	if(ownrReq.getSuccess())
	{
		var ownrObj = ownrReq.getOutput();
		for (xx in ownrObj)
		{
			ownrObj[xx].setCapID(tCapID);
			aa.owner.createCapOwnerWithAPOAttribute(ownrObj[xx]);
			logDebug("Copied Owner: " + ownrObj[xx].getOwnerFullName())
		}
	}
	else
		logDebug("Error Copying Owner : " + ownrObj.getErrorType() + " : " + ownrObj.getErrorMessage());
}
