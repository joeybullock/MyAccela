function contactAddFromUser(pUserId)
	{
	// Retrieves user's reference Contact record and adds to CAP
	// Returns contact seq nbr or false if contact not added
	// 06SSP-00186
	//
	if (arguments.length==1) //use parameter user
		{
		var personResult = aa.person.getUser(pUserId);
		if (personResult.getSuccess())
			{
			var personObj = personResult.getOutput();
			//logDebug("personObj class: "+personObj.getClass());
			if (personObj==null) // no user found
				{
				logDebug("**ERROR: Failed to get User");
				return false;
				}
			}
		else
  	  { 
			logDebug("**ERROR: Failed to get User: " + personResult.getErrorMessage()); 
			return false; 
			}
		}
	else //use current user
		var personObj = systemUserObj;
		
	var userFirst = personObj.getFirstName();
	var userMiddle = personObj.getMiddleName();
	var userLast = personObj.getLastName();
	
	//Find PeopleModel object for user 
	var peopleResult = aa.people.getPeopleByFMLName(userFirst, userMiddle, userLast);
	if (peopleResult.getSuccess())
		{
		var peopleObj = peopleResult.getOutput();
		//logDebug("peopleObj is "+peopleObj.getClass());
		if (peopleObj==null)
			{
			logDebug("No reference user found.");
			return false;
			}
		logDebug("No. of reference contacts found: "+peopleObj.length);
		}
	else
		{ 
			logDebug("**ERROR: Failed to get reference contact record: " + peopleResult.getErrorMessage()); 
			return false; 
		}
	
	//Add the reference contact record to the current CAP 
	var contactAddResult = aa.people.createCapContactWithRefPeopleModel(capId, peopleObj[0]);
	if (contactAddResult.getSuccess())
		{
		logDebug("Contact successfully added to CAP.");
		var capContactResult = aa.people.getCapContactByCapID(capId);
		if (capContactResult.getSuccess())
			{
			var Contacts = capContactResult.getOutput();
			var idx = Contacts.length;
			var contactNbr = Contacts[idx-1].getCapContactModel().getPeople().getContactSeqNumber();
			logDebug ("Contact Nbr = "+contactNbr);
			return contactNbr;
			}
		else
			{
			logDebug("**ERROR: Failed to get Contact Nbr: "+capContactResult.getErrorMessage());
			return false;
			}
		}
	else
		{ 
			logDebug("**ERROR: Cannot add contact: " + contactAddResult.getErrorMessage()); 
			return false; 
		}	
	} 
	
