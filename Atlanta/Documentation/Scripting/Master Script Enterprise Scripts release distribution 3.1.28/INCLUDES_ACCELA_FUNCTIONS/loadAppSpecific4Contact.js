function loadAppSpecific4Contact(thisArr, contactSeqNbr) {
	var itemCap = capId;
	if (arguments.length == 3)
		itemCap = arguments[2]; // use cap ID specified in args

	var capContactResult = aa.people.getCapContactByPK(itemCap, contactSeqNbr);
	if (capContactResult.getSuccess()) {
		var capContact = capContactResult.getOutput().getCapContactModel();

		if (capContact == null || capContact.getTemplate() == null || capContact.getTemplate().getTemplateForms() == null) {
			//logDebug("No found any Contact Template !");
			return;
		}

		var template = capContact.getTemplate();
		var templateForms = template.getTemplateForms();

		for (var i = 0; i < templateForms.size(); i++) {
			var eachForm = templateForms.get(i);

			//Sub Group
			var subGroup = eachForm.subgroups;

			if (subGroup == null) {
				continue;
			}

			for (var j = 0; j < subGroup.size(); j++) {
				var eachSubGroup = subGroup.get(j);

				if (eachSubGroup == null || eachSubGroup.fields == null) {
					continue;
				}

				var allFields = eachSubGroup.fields;
				for (var k = 0; k < allFields.size(); k++) {
					var eachField = allFields.get(k);
					thisArr[eachField.displayFieldName] = eachField.defaultValue;
				}
			}
		}
	}

}