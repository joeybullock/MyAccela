function genericTemplateObject(gtmp) {
	this.ASI = new Array(); //Condition Array
	this.ASIT = new Array();
	this.hasASI = false;
	this.hasTables = false;
	this.template = gtmp;

	var formGroupsObj = template.getTemplateForms();
	var formGroups = new Array();
	if (formGroupsObj != null) {
		aa.print(formGroupsObj);
		formGroups = formGroupsObj.toArray();
		for (grp in formGroups) {
			var subgroupsObj = formGroups[grp].getSubgroups();
			if (subgroupsObj != null) {
				var subgroups = subgroupsObj.toArray();
				this.hasASI = true;
				for (sgrp in subgroups) {
					var sgrpName = subgroups[sgrp].getSubgroupName();
					var fields = subgroups[sgrp].getFields().toArray();
					for (fld in fields) {
						this.ASI[sgrpName + "." + fields[fld].getFieldName()] = fields[fld].getDefaultValue();
					}
				}
			}
		}
	}

	var tableGroupsObj = template.getTemplateTables();
	var tableGroups = new Array();
	if (tableGroupsObj != null) {
		var tableGroups = tableGroupsObj.toArray();
		for (grp in tableGroups) {
			var subgroupsObj = tableGroups[grp].getSubgroups();
			if (subgroupsObj != null) {
				var subgroups = subgroupsObj.toArray();
				for (sgrp in subgroups) {
					var sgrpName = subgroups[sgrp].getSubgroupName();
					this.ASIT[sgrpName] = new Array();
					this.hasTables = true;
					var rowsObj = subgroups[sgrp].getRows();
					if (rowsObj != null) {
						var rows = rowsObj.toArray();
						for (i = 0; i < rows.length; i++) {
							this.ASIT[sgrpName][i] = new Array();
							var fields = rows[i].getValues().toArray();
							for (fld in fields) {
								this.ASIT[sgrpName][i][fields[fld].getFieldName()] = fields[fld].getValue();
							}
						}
					}
				}
			}
		}
	}

	return this;
}