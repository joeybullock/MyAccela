function getCSLBInfoBefore()
	{
	// Requires getNode and getProp functions.
	//
	// Get the first lic prof from the app
	//

	var rlpId = aa.env.getValue("CAEValidatedNumber")

	if (rlpId == "" || rlpId == null) return true;  // empty or null

	//
	// Now make the call to the California State License Board
	//

	var getout = aa.util.httpPost("http://www2.cslb.ca.gov/IVR/License+Detail.asp?LicNum=" + rlpId,"");
	if (getout.getSuccess())
	  var lpXML = getout.getOutput();
	else
	   { logDebug("**ERROR: communicating with CSLB: " + getout.getErrorMessage()); return false; }

	// Check to see if error message in the XML:

	if (lpXML.indexOf("<Error>") > 0 )
		{
		logDebug("**ERROR: CSLB information returned an error: " + getNode(getNode(lpXML,"License"),"**ERROR"))
		return false;
		}

	var lpBiz = getNode(lpXML,"BusinessInfo");
	var lpStatus = getNode(lpXML,"PrimaryStatus");
	var lpClass = getNode(lpXML,"Classifications");
	var lpBonds = getNode(lpXML,"ContractorBond");
	var lpWC = getNode(lpXML,"WorkersComp");

	var expDate = new Date(getNode(lpBiz,"ExpireDt"));
	if (expDate < startDate)
		{
		showMessage = true ;
		comment("**WARNING: Professional License expired on " + expDate.toString());
		}
	}

