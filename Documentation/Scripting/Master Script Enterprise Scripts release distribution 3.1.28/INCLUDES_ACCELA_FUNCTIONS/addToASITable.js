
  function addToASITable(tableName,tableValues) // optional capId
  	{
	//  tableName is the name of the ASI table
	//  tableValues is an associative array of values.  All elements must be either a string or asiTableVal object
  	itemCap = capId
	if (arguments.length > 2)
		itemCap = arguments[2]; // use cap ID specified in args

	var tssmResult = aa.appSpecificTableScript.getAppSpecificTableModel(itemCap,tableName)

	if (!tssmResult.getSuccess())
		{ logDebug("**WARNING: error retrieving app specific table " + tableName + " " + tssmResult.getErrorMessage()) ; return false }

	var tssm = tssmResult.getOutput();
	var tsm = tssm.getAppSpecificTableModel();
	var fld = tsm.getTableField();
	var col = tsm.getColumns();
	var fld_readonly = tsm.getReadonlyField(); //get ReadOnly property
	var coli = col.iterator();

	while (coli.hasNext())
		{
		colname = coli.next();

		if (!tableValues[colname.getColumnName()]) {
			logDebug("addToASITable: null or undefined value supplied for column " + colname.getColumnName() + ", setting to empty string");
			tableValues[colname.getColumnName()] = "";
			}
		
		if (typeof(tableValues[colname.getColumnName()].fieldValue) != "undefined")
			{
			fld.add(tableValues[colname.getColumnName()].fieldValue);
			fld_readonly.add(tableValues[colname.getColumnName()].readOnly);
			}
		else // we are passed a string
			{
			fld.add(tableValues[colname.getColumnName()]);
			fld_readonly.add(null);
			}
		}

	tsm.setTableField(fld);
	tsm.setReadonlyField(fld_readonly); // set readonly field

	addResult = aa.appSpecificTableScript.editAppSpecificTableInfos(tsm, itemCap, currentUserID);
	if (!addResult .getSuccess())
		{ logDebug("**WARNING: error adding record to ASI Table:  " + tableName + " " + addResult.getErrorMessage()) ; return false }
	else
		logDebug("Successfully added record to ASI Table: " + tableName);
	}

