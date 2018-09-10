
function editLookup(stdChoice,stdValue,stdDesc) 
	{
	//check if stdChoice and stdValue already exist; if they do, update;
	var bizDomScriptResult = aa.bizDomain.getBizDomainByValue(stdChoice,stdValue);
	if (bizDomScriptResult.getSuccess())
		{
		bds = bizDomScriptResult.getOutput();
		}
	else
		{
		logDebug("Std Choice(" + stdChoice + "," + stdValue + ") does not exist to edit, adding...");
		addLookup(stdChoice,stdValue,stdDesc);
		return false;
		}
	var bd = bds.getBizDomain()
		
	bd.setDescription(stdDesc);
	var editResult = aa.bizDomain.editBizDomain(bd)
	
	if (editResult.getSuccess())
		logDebug("Successfully edited Std Choice(" + stdChoice + "," + stdValue + ") = " + stdDesc);
	else
		logDebug("**ERROR editing Std Choice " + editResult.getErrorMessage());
	}

