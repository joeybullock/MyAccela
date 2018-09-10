 function getContactByType(conType,capId) {
    var contactArray = getPeople(capId);

    for(thisContact in contactArray) {
        if((contactArray[thisContact].getPeople().contactType).toUpperCase() == conType.toUpperCase())
            return contactArray[thisContact].getPeople();
    }

    return false;
}

