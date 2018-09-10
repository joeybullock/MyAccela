//
// Get the standard choices domain for this application type
//
// Requires sequential numbering scheme (01,02,03, etc.) and the maxEntries variable
//
// Rename to getScriptAction and place in your custom functions folder to revert back to master script version 1.6 functionality.
//
//
//
function getScriptAction_v1_6(strControl)
	{
	var actArray = new Array();
	var maxLength = String("" + maxEntries).length;

	for (var count=1; count <= maxEntries; count++)  // Must be sequential from 01 up to maxEntries
		{
		var countstr = "000000" + count;
		countstr = String(countstr).substring(countstr.length,countstr.length - maxLength);
		var bizDomScriptResult = aa.bizDomain.getBizDomainByValue(strControl,countstr);

	   	if (bizDomScriptResult.getSuccess())
	   		{
			bizDomScriptObj = bizDomScriptResult.getOutput();
			var myObj= new pairObj(bizDomScriptObj.getBizdomainValue());
			myObj.load(bizDomScriptObj.getDescription());
			if (bizDomScriptObj.getAuditStatus() == 'I') myObj.enabled = false;
			actArray.push(myObj);
			}
		else
			{
			break;
			}
		}
	return actArray;
	}

