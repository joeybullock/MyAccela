
function comparePeopleStandard(peop)
	{

	/* 
	
		this function will be passed as a parameter to the createRefContactsFromCapContactsAndLink function.
		takes a single peopleModel as a parameter, and will return the sequence number of the first G6Contact result
		returns null if there are no matches
	
		Best Practice Template Version uses the following algorithm:
		
		1.  Match on SSN/FEIN if either exist
		2.  else, match on Email Address if it exists
		3.  else, match on First, Middle, Last Name combined with birthdate if all exist
		
		This function can use attributes if desired
	*/
	

	if (peop.getSocialSecurityNumber() || peop.getFein())
		{
		var qryPeople = aa.people.createPeopleModel().getOutput().getPeopleModel();
		
		logDebug("we have a SSN " + peop.getSocialSecurityNumber() + " or FEIN, checking on that");
		qryPeople.setSocialSecurityNumber(peop.getSocialSecurityNumber());
		qryPeople.setFein(peop.getFein());
		
		var r = aa.people.getPeopleByPeopleModel(qryPeople);
		
		if (!r.getSuccess())  { logDebug("WARNING: error searching for people : " + r.getErrorMessage()); return false; }

		var peopResult = r.getOutput();
		
		if (peopResult.length > 0)
			{
			logDebug("Searched for a REF Contact, " + peopResult.length + " matches found! returning the first match : " + peopResult[0].getContactSeqNumber() );
			return peopResult[0].getContactSeqNumber();
			}
		}
		
	if (peop.getEmail())
		{
		var qryPeople = aa.people.createPeopleModel().getOutput().getPeopleModel();
		
		qryPeople.setServiceProviderCode(aa.getServiceProviderCode());	
	
		logDebug("we have an email, checking on that");
		qryPeople.setEmail(peop.getEmail());

		var r = aa.people.getPeopleByPeopleModel(qryPeople);

		if (!r.getSuccess())  { logDebug("WARNING: error searching for people : " + r.getErrorMessage()); return false; }

		var peopResult = r.getOutput();

		if (peopResult.length > 0)
			{
			logDebug("Searched for a REF Contact, " + peopResult.length + " matches found! returning the first match : " + peopResult[0].getContactSeqNumber() );
			return peopResult[0].getContactSeqNumber();
			}
		}

	if (peop.getBirthDate() && peop.getLastName() && peop.getFirstName())
		{
		var qryPeople = aa.people.createPeopleModel().getOutput().getPeopleModel();		
		logDebug("we have a name and birthdate, checking on that");
		qryPeople.setBirthDate(peop.getBirthDate());
		qryPeople.setLastName(peop.getLastName());
		qryPeople.setFirstName(peop.getFirstName());
		qryPeople.setMiddleName(peop.getMiddleName());

		var r = aa.people.getPeopleByPeopleModel(qryPeople);

		if (!r.getSuccess())  { logDebug("WARNING: error searching for people : " + r.getErrorMessage()); return false; }

		var peopResult = r.getOutput();

		if (peopResult.length > 0)
			{
			logDebug("Searched for a REF Contact, " + peopResult.length + " matches found! returning the first match : " + peopResult[0].getContactSeqNumber() );
			return peopResult[0].getContactSeqNumber();
			}
		}
		
	logDebug("ComparePeople did not find a match");
		return false;
	}
