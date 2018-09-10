
function addPublicUserLPsToRecord(itemCapId,publicUser)

	{
	var publicUserModelResult = aa.publicUser.getPublicUserByPUser(publicUser);

	if (!publicUserModelResult.getSuccess() || !publicUserModelResult.getOutput())  {
		logDebug("**WARNING** couldn't find public user " + publicUser + " " + publicUserModelResult.getErrorMessage()); return false; }

	var userSeqNum = publicUserModelResult.getOutput().getUserSeqNum();

	var associatedLPResult = aa.licenseScript.getRefLicProfByOnlineUser(userSeqNum);

	if (!associatedLPResult.getSuccess() || !associatedLPResult.getOutput())  {
		logDebug("**WARNING** no associated LPs to publuc user " + publicUser + " " + associatedLPResult.getErrorMessage()); return false; }

	var associatedLPs = associatedLPResult.getOutput();

	for (var x in associatedLPs)
		{
		var lp = associatedLPs[x];
		var attachResult = aa.licenseScript.associateLpWithCap(capId,lp)

		if (!attachResult.getSuccess())  {
			logDebug("**WARNING** failed to associate LP " + lp.getStateLicense + " to Record " + attachResult.getErrorMessage()); }
		else
			logDebug("Associated LP " + lp.getStateLicense() + " to Record " + itemCapId.getCustomID())
		}


	}




