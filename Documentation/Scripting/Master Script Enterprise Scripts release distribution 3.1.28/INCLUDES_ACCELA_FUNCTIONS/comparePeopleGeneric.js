function comparePeopleGeneric(peop)
	{

	// this function will be passed as a parameter to the createRefContactsFromCapContactsAndLink function.
	//
	// takes a single peopleModel as a parameter, and will return the sequence number of the first G6Contact result
	//
	// returns null if there are no matches
	//
	// current search method is by email only.  In order to use attributes enhancement 09ACC-05048 must be implemented
	//

	peop.setAuditDate(null)
	peop.setAuditID(null)
	peop.setAuditStatus(null)
	peop.setBirthDate(null)
	peop.setBusName2(null)
	peop.setBusinessName(null)
	peop.setComment(null)
	peop.setCompactAddress(null)
	peop.setContactSeqNumber(null)
	peop.setContactType(null)
	peop.setContactTypeFlag(null)
	peop.setCountry(null)
	peop.setCountryCode(null)
	// peop.setEmail(null)       just as a test we are using email
	peop.setEndBirthDate(null)
	peop.setFax(null)
	peop.setFaxCountryCode(null)
	peop.setFein(null)
	peop.setFirstName(null)
	peop.setFlag(null)
	peop.setFullName(null)
	peop.setGender(null)
	peop.setHoldCode(null)
	peop.setHoldDescription(null)
	peop.setId(null)
	peop.setIvrPinNumber(null)
	peop.setIvrUserNumber(null)
	peop.setLastName(null)
	peop.setMaskedSsn(null)
	peop.setMiddleName(null)
	peop.setNamesuffix(null)
	peop.setPhone1(null)
	peop.setPhone1CountryCode(null)
	peop.setPhone2(null)
	peop.setPhone2CountryCode(null)
	peop.setPhone3(null)
	peop.setPhone3CountryCode(null)
	peop.setPostOfficeBox(null)
	peop.setPreferredChannel(null)
	peop.setPreferredChannelString(null)
	peop.setRate1(null)
	peop.setRelation(null)
	peop.setSalutation(null)
	peop.setServiceProviderCode(null)
	peop.setSocialSecurityNumber(null)
	peop.setTitle(null)
	peop.setTradeName(null)

	var r = aa.people.getPeopleByPeopleModel(peop);

    if (!r.getSuccess())
			{ logDebug("WARNING: error searching for people : " + r.getErrorMessage()); return false; }

	var peopResult = r.getOutput();

	if (peopResult.length == 0)
		{
		logDebug("Searched for REF contact, no matches found, returing null");
		return null;
		}

	if (peopResult.length > 0)
		{
		logDebug("Searched for a REF Contact, " + peopResult.length + " matches found! returning the first match : " + peopResult[0].getContactSeqNumber() );
		return peopResult[0].getContactSeqNumber()
		}

}