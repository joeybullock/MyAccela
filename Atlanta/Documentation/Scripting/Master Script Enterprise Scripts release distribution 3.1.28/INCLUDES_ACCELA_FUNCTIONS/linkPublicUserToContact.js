 function linkPublicUserToContact()   // optional: Contact Type, default Applicant
{
    var contactType = "Applicant";
    var contact;
    var refContactNum;
    var userModel;
    if (arguments.length > 0) contactType = arguments[0]; // use contact type specified

    var capContactResult = aa.people.getCapContactByCapID(capId);
    if (capContactResult.getSuccess()) {
		var Contacts = capContactResult.getOutput();
        for (yy in Contacts) {
            if (contactType.equals(Contacts[yy].getCapContactModel().getPeople().getContactType()))
				contact = Contacts[yy];
        }
    }
    
    if (!contact)
    { logDebug("Couldn't link public user for " + contactType + ", no such contact"); return false; }


	if (contact.getPeople().getContactTypeFlag().equals("organization"))
	{ logDebug("Couldn't link public user for " + contactType + ", the contact is an organization"); return false; }
	
    // get the reference contact ID.   We will use to connect to the new public user
    refContactNum = contact.getCapContactModel().getRefContactNumber();

    // check to see if public user exists already based on email address
    var getUserResult = aa.publicUser.getPublicUserByPUser(publicUserID);
    if (getUserResult.getSuccess() && getUserResult.getOutput()) {
        userModel = getUserResult.getOutput();
        logDebug("linkPublicUserToContact: Found an existing public user: " + userModel.getUserID());
	} else {
		logDebug("Couldn't link public user for " + contactType + ", no such public user"); return false;
	}

	//  Now that we have a public user let's connect to the reference contact		
	
	if (refContactNum)
		{
		logDebug("linkPublicUserToContact: Linking this public user with reference contact : " + refContactNum);
		aa.licenseScript.associateContactWithPublicUser(userModel.getUserSeqNum(), refContactNum);
		}
	
	return userModel; // send back the new or existing public user
}

