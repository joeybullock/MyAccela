 function editAppSpecific4ACA(itemName, itemValue) {

    var i = cap.getAppSpecificInfoGroups().iterator();

    while (i.hasNext()) {
        var group = i.next();
        var fields = group.getFields();
        if (fields != null) {
            var iteFields = fields.iterator();
            while (iteFields.hasNext()) {
                var field = iteFields.next();
                if ((useAppSpecificGroupName && itemName.equals(field.getCheckboxType() + "." + 

field.getCheckboxDesc())) || itemName.equals(field.getCheckboxDesc())) {
                    field.setChecklistComment(itemValue);
                }
            }
        }
    }
}

