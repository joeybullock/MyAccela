function copyAppSpecific4ACA(capFrom) { // copy all App Specific info into new Cap
var i= capFrom.getAppSpecificInfoGroups().iterator();

    while (i.hasNext())
    {
         var group = i.next();
         var fields = group.getFields();
         if (fields != null)
            {
            var iteFields = fields.iterator();
            while (iteFields.hasNext())
            {
                 var field = iteFields.next();

                    if (useAppSpecificGroupName)
                            editAppSpecific4ACA(field.getCheckboxType() + "." + field.getCheckboxDesc(),field.getChecklistComment());
                    else
                            editAppSpecific4ACA(field.getCheckboxDesc(),field.getChecklistComment());
           }
        }
    }
}
