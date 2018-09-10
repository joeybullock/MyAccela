function executeASITable(tableArray)
	{
	// Executes an ASI table as if it were script commands
	// No capability for else or continuation statements
	// Assumes that there are at least three columns named "Enabled", "Criteria", "Action"
	// Will replace tokens in the controls
	
	//var thisDate = new Date();
	//var thisTime = thisDate.getTime();
	//logDebug("Executing ASI Table, Elapsed Time: "  + ((thisTime - startTime) / 1000) + " Seconds")

	for (xx in tableArray)
		{
 
		var doTableObj = tableArray[xx]; 
		var myCriteria = doTableObj["Criteria"]; aa.print("cri: " + myCriteria)
		var myAction = doTableObj["Action"];  aa.print("act: " + myAction)
		aa.print("enabled: " + doTableObj["Enabled"])
      
		if (doTableObj["Enabled"] == "Yes")
			if (eval(token(myCriteria)))
				eval(token(myAction));

		} // next action
	//var thisDate = new Date();
	//var thisTime = thisDate.getTime();
	//logDebug("Finished executing ASI Table, Elapsed Time: "  + ((thisTime - startTime) / 1000) + " Seconds")
	}

