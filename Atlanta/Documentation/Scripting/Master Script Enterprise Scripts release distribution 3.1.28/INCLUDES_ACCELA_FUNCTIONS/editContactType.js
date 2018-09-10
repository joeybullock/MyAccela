 function editContactType(existingType,newType)
//Function will change contact types from exsistingType to newType, 
//optional paramter capID
{
    var updateCap = capId
    if (arguments.length==3)
        updateCap=arguments[2]

    capContactResult = aa.people.getCapContactByCapID(updateCap);
    if (capContactResult.getSuccess())
        {
        Contacts = capContactResult.getOutput();
        for (yy in Contacts)
            {
            var theContact = Contacts[yy].getCapContactModel();
            if(theContact.getContactType() == existingType)
                {
                theContact.setContactType(newType);
                var peopleModel = theContact.getPeople();
                var contactAddressrs = aa.address.getContactAddressListByCapContact(theContact);
                if (contactAddressrs.getSuccess())
                {
                    var contactAddressModelArr = convertContactAddressModelArr(contactAddressrs.getOutput());
                    peopleModel.setContactAddressList(contactAddressModelArr);    
                }
                aa.people.editCapContactWithAttribute(theContact);
                //logDebug("Contact for " + theContact.getFullName() + " Updated to " + newType);
                }
            }
        }
    }

