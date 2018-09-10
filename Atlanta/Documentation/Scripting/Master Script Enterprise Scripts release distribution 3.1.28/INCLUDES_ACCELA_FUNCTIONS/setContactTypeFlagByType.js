function setContactTypeFlagByType(itemCap) {
	
	var contactsA = getContactObjs(itemCap);

	for (var x in contactsA) {
		thisContact = contactsA[x];
		
		var typeFlag = lookup("CONTACT TYPE FLAG",thisContact.type);

		if (typeFlag == undefined)
			continue; //skip if not setup in the lookup

		thisContact.people.setContactTypeFlag(typeFlag);

		thisContact.save();
	}	
}

