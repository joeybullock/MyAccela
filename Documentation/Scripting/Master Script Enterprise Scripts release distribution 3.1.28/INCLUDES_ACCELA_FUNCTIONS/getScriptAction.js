//
// Get the standard choices domain for this application type
//
// Uses free-form alphanumeric indexing.   All enabled script controls will execute.   See getScriptAction_v_1_6 to revert back to sequential numbering scheme
//
function getScriptAction(strControl)
	{
	var actArray = new Array();
	var maxLength = String("" + maxEntries).length;
	
	var bizDomScriptResult = aa.bizDomain.getBizDomain(strControl);
	
	if (bizDomScriptResult.getSuccess())
		{
		bizDomScriptArray = bizDomScriptResult.getOutput().toArray()
		
		for (var i in bizDomScriptArray)
			{
			// this list is sorted the same as the UI, no reason to re-sort
			
			var myObj= new pairObj(bizDomScriptArray[i].getBizdomainValue());
			myObj.load(bizDomScriptArray[i].getDescription());
			if (bizDomScriptArray[i].getAuditStatus() == 'I') myObj.enabled = false;
			actArray.push(myObj);
			}
		}
	
	return actArray;
	}

