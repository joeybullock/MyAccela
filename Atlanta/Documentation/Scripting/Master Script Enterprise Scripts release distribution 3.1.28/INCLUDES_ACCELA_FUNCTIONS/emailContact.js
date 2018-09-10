function emailContact(mSubj,mText)   // optional: Contact Type, default Applicant
	{
	var replyTo = "noreply@accela.com";
	var contactType = "Applicant"
	var emailAddress = "";

	if (arguments.length == 3) contactType = arguments[2]; // use contact type specified

	var capContactResult = aa.people.getCapContactByCapID(capId);
	if (capContactResult.getSuccess())
		{
		var Contacts = capContactResult.getOutput();
		for (yy in Contacts)
			if (contactType.equals(Contacts[yy].getCapContactModel().getPeople().getContactType()))
				if (Contacts[yy].getEmail() != null)
					emailAddress = "" + Contacts[yy].getEmail();
		}

	if (emailAddress.indexOf("@") > 0)
		{
		aa.sendMail(replyTo, emailAddress, "", mSubj, mText);
		logDebug("Successfully sent email to " + contactType);
		}
	else
		logDebug("Couldn't send email to " + contactType + ", no valid email address");
	}