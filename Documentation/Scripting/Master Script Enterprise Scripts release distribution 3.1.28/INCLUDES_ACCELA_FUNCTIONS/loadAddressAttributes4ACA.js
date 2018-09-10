
function loadAddressAttributes4ACA(thisArr)
{
	//
	// Returns an associative array of Address Attributes from ACA cap model
	// 
	//

	fcapAddressObj = cap.getAddressModel();

  	if (!fcapAddressObj)
  		{ logDebug("No Address to get attributes"); return false; }
  	
	addressAttr = fcapAddressObj.getAttributes();
		
	if (!addressAttr)
		{ logDebug("No attributes on this address") ; return false ; }

	addressAttrObj = addressAttr.toArray();

	for (z in addressAttrObj)
		thisArr["AddressAttribute." + addressAttrObj[z].getB1AttributeName()]=addressAttrObj[z].getB1AttributeValue();

	// Explicitly load some standard values
	thisArr["AddressAttribute.PrimaryFlag"] = fcapAddressObj.getPrimaryFlag();
	thisArr["AddressAttribute.HouseNumberStart"] = fcapAddressObj.getHouseNumberStart();
	thisArr["AddressAttribute.StreetDirection"] = fcapAddressObj.getStreetDirection();
	thisArr["AddressAttribute.StreetName"] = fcapAddressObj.getStreetName();
	thisArr["AddressAttribute.StreetSuffix"] = fcapAddressObj.getStreetSuffix();
	thisArr["AddressAttribute.City"] = fcapAddressObj.getCity();
	thisArr["AddressAttribute.State"] = fcapAddressObj.getState();
	thisArr["AddressAttribute.Zip"] = fcapAddressObj.getZip();
	thisArr["AddressAttribute.AddressStatus"] = fcapAddressObj.getAddressStatus();
	thisArr["AddressAttribute.County"] = fcapAddressObj.getCounty();
	thisArr["AddressAttribute.Country"] = fcapAddressObj.getCountry();
	thisArr["AddressAttribute.AddressDescription"] = fcapAddressObj.getAddressDescription();
	thisArr["AddressAttribute.XCoordinate"] = fcapAddressObj.getXCoordinator();
	thisArr["AddressAttribute.YCoordinate"] = fcapAddressObj.getYCoordinator();
}
