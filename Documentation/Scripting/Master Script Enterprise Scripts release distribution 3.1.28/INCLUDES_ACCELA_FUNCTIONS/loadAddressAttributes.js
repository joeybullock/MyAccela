function loadAddressAttributes(thisArr)
{
	//
	// Returns an associative array of Address Attributes
	// Optional second parameter, cap ID to load from
	//

	var itemCap = capId;
	if (arguments.length == 2) itemCap = arguments[1]; // use cap ID specified in args

	var fcapAddressObj = null;
   	var capAddressResult = aa.address.getAddressWithAttributeByCapId(itemCap);
   	if (capAddressResult.getSuccess())
   		var fcapAddressObj = capAddressResult.getOutput();
   	else
     		logDebug("**ERROR: Failed to get Address object: " + capAddressResult.getErrorType() + ":" + capAddressResult.getErrorMessage())

  	for (i in fcapAddressObj)
  	{
  		addressAttrObj = fcapAddressObj[i].getAttributes().toArray();
  		for (z in addressAttrObj)
			thisArr["AddressAttribute." + addressAttrObj[z].getB1AttributeName()]=addressAttrObj[z].getB1AttributeValue();

		// Explicitly load some standard values
		thisArr["AddressAttribute.PrimaryFlag"] = fcapAddressObj[i].getPrimaryFlag();
		thisArr["AddressAttribute.HouseNumberStart"] = fcapAddressObj[i].getHouseNumberStart();
		thisArr["AddressAttribute.StreetDirection"] = fcapAddressObj[i].getStreetDirection();
		thisArr["AddressAttribute.StreetName"] = fcapAddressObj[i].getStreetName();
		thisArr["AddressAttribute.StreetSuffix"] = fcapAddressObj[i].getStreetSuffix();
		thisArr["AddressAttribute.City"] = fcapAddressObj[i].getCity();
		thisArr["AddressAttribute.State"] = fcapAddressObj[i].getState();
		thisArr["AddressAttribute.Zip"] = fcapAddressObj[i].getZip();
		thisArr["AddressAttribute.AddressStatus"] = fcapAddressObj[i].getAddressStatus();
		thisArr["AddressAttribute.County"] = fcapAddressObj[i].getCounty();
		thisArr["AddressAttribute.Country"] = fcapAddressObj[i].getCountry();
		thisArr["AddressAttribute.AddressDescription"] = fcapAddressObj[i].getAddressDescription();
		thisArr["AddressAttribute.XCoordinate"] = fcapAddressObj[i].getXCoordinator();
		thisArr["AddressAttribute.YCoordinate"] = fcapAddressObj[i].getYCoordinator();
  	}
}
