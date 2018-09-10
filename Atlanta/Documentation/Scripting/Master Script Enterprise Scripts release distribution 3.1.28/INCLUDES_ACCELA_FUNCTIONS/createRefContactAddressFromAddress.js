function createRefContactAddressFromAddress(rSeqNbr,nAddrModel,addrType) {
						
	if (nAddrModel && rSeqNbr) {
		var contactAddressScriptModel = aa.address.createContactAddressModel().getOutput();
		contactAddressScriptModel.setServiceProviderCode(servProvCode);
		contactAddressScriptModel.setAuditStatus("A");
		contactAddressScriptModel.setAuditID(currentUserID);
		var contactAddressModel = contactAddressScriptModel.getContactAddressModel();
		contactAddressModel.setEntityID(parseInt(rSeqNbr));
		contactAddressModel.setEntityType("CONTACT");
		contactAddressModel.setAddressType(addrType);
		contactAddressModel.setAddressLine1(nAddrModel.getAddressLine1());
	   	contactAddressModel.setAddressLine2(nAddrModel.getAddressLine2());
	   	contactAddressModel.setAddressLine3(nAddrModel.getCounty());
	   	contactAddressModel.setHouseNumberStart(nAddrModel.getHouseNumberStart());
	   	contactAddressModel.setHouseNumberEnd(nAddrModel.getHouseNumberEnd());
	   	// contactAddressModel.setStreetDirection("ZF");
	   	// contactAddressModel.setStreetPrefix("Pre");
	   	contactAddressModel.setStreetName(nAddrModel.getStreetName());
	   	// contactAddressModel.setStreetSuffix("Suf");
	   	// contactAddressModel.setStreetSuffixDirection("SufD");
	   	contactAddressModel.setCity(nAddrModel.getCity());
	   	contactAddressModel.setState(nAddrModel.getState());
	   	contactAddressModel.setZip(nAddrModel.getZip());
	   	//contactAddressModel.setCountry(nAddrModel.getCountry());
	   	// contactAddressModel.setFax("0982-4343-343");
	   	//var startDate = aa.util.parseDate("09/12/2012");
	  	//var endDate =  conversionDate("09/12/2013");
	   	//contactAddressModel.setEffectiveDate(startDate);

		var contactAddressModel = contactAddressScriptModel.getContactAddressModel();
		var returnModel = aa.address.createContactAddress(contactAddressModel);

		if(returnModel.getSuccess()) {
		 	logDebug("Create Contact Address Successfully: " + returnModel.getOutput().getAddressID());
		 	return returnModel.getOutput();
	  	}
	  	else {
			logDebug("Create Contact Address Failed:" + returnModel.getErrorMessage());
			return false;
	  	}
	} else {
		logDebug("Could not create reference contact address no address model or reference contact sequence number");
		return false;
	}						
}