
function editCapContactAttribute(contactSeq,pAttributeName,pNewAttributeValue)
	{

    	var itemCap = capId;
  	if (arguments.length > 3)
  		itemCap = arguments[3]; // use cap ID specified in args
 

	var oldValue = null;
	
	var ca = aa.people.getCapContactByCapID(itemCap).getOutput();

	for (var i in ca)
		{
		var attrfound = false;
		var p = ca[i].getCapContactModel().getPeople();
		
		if (p.getContactSeqNumber() != contactSeq) 
			continue;
		
		var peopAttrArray = p.getAttributes().toArray();

		for (var j in peopAttrArray)
			{
			if ( pAttributeName.equals(peopAttrArray[j].getAttributeName()))
				{
				oldValue = peopAttrArray[j].getAttributeValue();
				peopAttrArray[j].setAttributeValue(pNewAttributeValue);
				attrfound = true;
				break;
				}
			}

		if (attrfound)
			{
			logDebug("Updated Cap Contact: " + contactSeq + ", attribute: " + pAttributeName + " from: " + oldValue + " to: " + pNewAttributeValue);
			ca[i].getCapContactModel().setPeople(p);
			var editResult = aa.people.editCapContactWithAttribute(ca[i].getCapContactModel());

		}
	}
	
}
